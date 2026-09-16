import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { DEFAULT_WEDDING_CONFIG, mergeWeddingConfig, type WeddingConfig } from './weddingConfig'

/**
 * Standalone Supabase fetch hook for the /wedding route.
 *
 * The /wedding page lives OUTSIDE the Root layout (no SiteProvider).
 * This hook fetches the wedding config directly from the same
 * site_config row that the admin panel writes to.
 *
 * Falls back to DEFAULT_WEDDING_CONFIG while loading or on error.
 */
export function useWeddingConfig(): { config: WeddingConfig; loading: boolean } {
  const [config, setConfig] = useState<WeddingConfig>(DEFAULT_WEDDING_CONFIG)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchConfig() {
      try {
        const { data } = await supabase
          .from('site_config')
          .select('data')
          .eq('id', 1)
          .single()

        if (!cancelled && data?.data?.wedding) {
          setConfig(mergeWeddingConfig(data.data.wedding as Partial<WeddingConfig>))
        }
      } catch {
        // Silently fall back to defaults
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchConfig()
    return () => { cancelled = true }
  }, [])

  return { config, loading }
}
