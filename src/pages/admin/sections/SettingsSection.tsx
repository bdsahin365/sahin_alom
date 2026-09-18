import { useSite } from '../../../context/SiteContext'
import {
  Section,
  Grid2,
  Input,
  Textarea,
  Switch,
} from '../components/AdminPrimitives'

export default function SettingsSection() {
  const { data: { settings, engineer }, updateSettings, updateEngineer } = useSite()

  const gaId = settings.analytics?.googleAnalyticsId || ''
  const clarityId = settings.analytics?.clarityId || ''
  const googleVer = settings.verification?.googleSiteVerification || ''
  const bingVer = settings.verification?.bingSiteVerification || ''
  const yandexVer = settings.verification?.yandexVerification || ''
  const pinterestVer = settings.verification?.pinterestVerification || ''

  return (
    <div>
      {/* 1. Web Analytics & UX Tracking */}
      <Section
        title="Google Analytics 4 & UX Tracking"
        description="Connect GA4 Measurement ID and Microsoft Clarity for visitor metrics and session heatmaps."
      >
        <Grid2>
          <div>
            <Input
              label="Google Analytics 4 (GA4) ID"
              hint="Format: G-XXXXXXXXXX"
              value={gaId}
              onChange={v =>
                updateSettings({
                  analytics: {
                    ...settings.analytics,
                    googleAnalyticsId: v.trim(),
                  },
                })
              }
              placeholder="G-D2L3P6E88X"
            />
            <p style={{ fontSize: 11, color: '#64748B', marginTop: -10, marginBottom: 12 }}>
              Get from{' '}
              <a href="https://analytics.google.com" target="_blank" rel="noreferrer" style={{ color: '#C47D0E', textDecoration: 'underline' }}>
                Google Analytics
              </a>{' '}
              → Admin → Data Streams → Measurement ID
            </p>
          </div>

          <div>
            <Input
              label="Microsoft Clarity Project ID"
              hint="Session heatmaps & recordings"
              value={clarityId}
              onChange={v =>
                updateSettings({
                  analytics: {
                    ...settings.analytics,
                    clarityId: v.trim(),
                  },
                })
              }
              placeholder="e.g. j7k2m9x1..."
            />
            <p style={{ fontSize: 11, color: '#64748B', marginTop: -10, marginBottom: 12 }}>
              Get from{' '}
              <a href="https://clarity.microsoft.com" target="_blank" rel="noreferrer" style={{ color: '#C47D0E', textDecoration: 'underline' }}>
                Microsoft Clarity
              </a>{' '}
              → Settings → Overview → Project ID
            </p>
          </div>
        </Grid2>
      </Section>

      {/* 2. Search Engine & Webmaster Tools Verification */}
      <Section
        title="Search Engine & Webmaster Tools Verification"
        description="Verify site ownership with Google Search Console, Bing Webmaster, and Yandex without modifying code."
      >
        <Grid2>
          <div>
            <Input
              label="Google Search Console (HTML Tag Code)"
              hint="google-site-verification value"
              value={googleVer}
              onChange={v =>
                updateSettings({
                  verification: {
                    ...settings.verification,
                    googleSiteVerification: v.trim(),
                  },
                })
              }
              placeholder="google-site-verification-xxxxxx..."
            />
            <p style={{ fontSize: 11, color: '#64748B', marginTop: -10, marginBottom: 12 }}>
              Get from{' '}
              <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" style={{ color: '#C47D0E', textDecoration: 'underline' }}>
                Google Search Console
              </a>{' '}
              → Settings → Ownership Verification → HTML Tag
            </p>
          </div>

          <div>
            <Input
              label="Bing Webmaster Tools Code"
              hint="msvalidate.01 meta content"
              value={bingVer}
              onChange={v =>
                updateSettings({
                  verification: {
                    ...settings.verification,
                    bingSiteVerification: v.trim(),
                  },
                })
              }
              placeholder="bing-site-verification-xxxxxx..."
            />
            <p style={{ fontSize: 11, color: '#64748B', marginTop: -10, marginBottom: 12 }}>
              Get from{' '}
              <a href="https://www.bing.com/webmasters" target="_blank" rel="noreferrer" style={{ color: '#C47D0E', textDecoration: 'underline' }}>
                Bing Webmaster Tools
              </a>{' '}
              → Verification → Meta Tag
            </p>
          </div>
        </Grid2>

        <Grid2>
          <Input
            label="Yandex Webmaster Verification (Optional)"
            value={yandexVer}
            onChange={v =>
              updateSettings({
                verification: {
                  ...settings.verification,
                  yandexVerification: v.trim(),
                },
              })
            }
            placeholder="yandex-verification-code..."
          />

          <Input
            label="Pinterest / Other Verification (Optional)"
            value={pinterestVer}
            onChange={v =>
              updateSettings({
                verification: {
                  ...settings.verification,
                  pinterestVerification: v.trim(),
                },
              })
            }
            placeholder="p:domain_verify code..."
          />
        </Grid2>
      </Section>

      {/* 3. Global Site SEO & Identity */}
      <Section title="Site Identity & Global SEO">
        <Input
          label="Website Base URL"
          hint="Canonical URL (e.g. https://sahinalom.com)"
          value={settings.siteUrl || ''}
          onChange={v => updateSettings({ siteUrl: v })}
          placeholder="https://sahinalom.com"
        />
        <Input
          label="Browser Tab Title"
          value={settings.siteTitle}
          onChange={v => updateSettings({ siteTitle: v })}
          placeholder="Md Sahin Alom — Senior Electrical Engineer"
        />
        <Textarea
          label="Default Meta Description"
          hint="Used for search engine summary snippets"
          value={settings.pageDescription}
          onChange={v => updateSettings({ pageDescription: v })}
          rows={2}
        />
      </Section>

      {/* 4. Social Links & Profiles */}
      <Section title="Social & Professional Profiles">
        <Grid2>
          <Input
            label="LinkedIn URL"
            value={settings.social.linkedin}
            onChange={v => updateSettings({ social: { ...settings.social, linkedin: v } })}
            placeholder="https://linkedin.com/in/sahinalom"
          />
          <Input
            label="GitHub URL"
            value={settings.social.github}
            onChange={v => updateSettings({ social: { ...settings.social, github: v } })}
            placeholder="https://github.com/bdsahin365"
          />
        </Grid2>
        <Grid2>
          <Input
            label="Twitter / X Profile"
            value={settings.social.twitter}
            onChange={v => updateSettings({ social: { ...settings.social, twitter: v } })}
            placeholder="https://twitter.com/sahinalom"
          />
          <Input
            label="Facebook Profile (Optional)"
            value={settings.social.facebook || ''}
            onChange={v => updateSettings({ social: { ...settings.social, facebook: v } })}
            placeholder="https://facebook.com/sahinalom"
          />
        </Grid2>
        <Input
          label="YouTube Channel (Optional)"
          value={settings.social.youtube || ''}
          onChange={v => updateSettings({ social: { ...settings.social, youtube: v } })}
          placeholder="https://youtube.com/@sahinalom"
        />
      </Section>

      {/* 5. Live Project Availability */}
      <Section title="Consultation Availability">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Switch checked={engineer.available} onChange={v => updateEngineer({ available: v })} />
          <div>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 500, fontSize: 13, color: '#1E293B' }}>
              Available for new projects & consultations
            </div>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#64748B', marginTop: 2 }}>
              Controls the live green radar indicator in the header navigation and hero section.
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
