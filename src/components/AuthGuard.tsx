import { useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router'
import { supabase } from '../lib/supabase'
import type { Session } from '@supabase/supabase-js'

export default function AuthGuard() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => setSession(data?.session ?? null))
      .catch(() => setSession(null))

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => data?.subscription?.unsubscribe()
  }, [])

  // Still checking
  if (session === undefined) return null

  if (!session) return <Navigate to="/admin/login" replace />

  return <Outlet />
}
