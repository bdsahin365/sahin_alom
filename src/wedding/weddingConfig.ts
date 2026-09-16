/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  WEDDING INVITATION — CONFIG TYPE + DEFAULTS                        ║
 * ║                                                                      ║
 * ║  This file defines the shape of the wedding config and its defaults. ║
 * ║  Live values are stored in Supabase site_config and managed via the  ║
 * ║  Admin Dashboard → Settings → Marriage Invitation.                   ║
 * ║                                                                      ║
 * ║  You no longer need to edit this file to change content.            ║
 * ║  Use the admin panel at /admin instead.                              ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type WeddingStoryItem = {
  day: string        // e.g. "08"
  fullDate: string   // e.g. "08 Feb 2026"
  title: string
  body: string
}

export type WeddingEvent = {
  id: string
  label: string      // English label e.g. "Gaye Holud"
  arabic: string     // Bengali label e.g. "গায়ে হলুদ"
  date: string       // e.g. "12.02.26"
  day: string        // e.g. "Thursday"
  time: string       // e.g. "4:00 PM onwards"
  description: string
}

export type WeddingConfig = {
  // ── Kill Switch ────────────────────────────────────────────────────────────
  enabled: boolean

  // ── Couple ─────────────────────────────────────────────────────────────────
  groomName: string
  groomFullName: string
  brideName: string
  brideFullName: string
  displayName: string     // e.g. "Sahin & Nusrat"
  tagline: string
  heroSubtitle: string

  // ── Images ─────────────────────────────────────────────────────────────────
  heroImage: string       // URL or base64
  groomPhoto: string      // URL or base64
  bridePhoto: string      // URL or base64
  showCouplePhotos: boolean

  // ── Story / Timeline ───────────────────────────────────────────────────────
  story: WeddingStoryItem[]

  // ── Rhythm section ─────────────────────────────────────────────────────────
  rhythmHeadline: string
  rhythmBody: string

  // ── Events ─────────────────────────────────────────────────────────────────
  events: WeddingEvent[]

  // ── Venue ───────────────────────────────────────────────────────────────────
  venueName: string
  venueArea: string
  venueDetail: string
  venueMapsUrl: string

  // ── RSVP ────────────────────────────────────────────────────────────────────
  rsvpFormspreeId: string
  rsvpDeadline: string
  rsvpConfirmationNote: string

  // ── Closing ──────────────────────────────────────────────────────────────────
  closingDua: string
  closingDuaTranslation: string
  closingDuaSource: string

  // ── Bismillah / Loader ───────────────────────────────────────────────────────
  bismillah: string
  loaderTagline: string
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULTS  (used when no admin data is present)
// ─────────────────────────────────────────────────────────────────────────────
export const DEFAULT_WEDDING_CONFIG: WeddingConfig = {
  enabled: true,

  groomName: 'Sahin',
  groomFullName: 'Md. Sahin Alom',
  brideName: 'Nusrat',
  brideFullName: 'Nusrat Jahan',
  displayName: 'Sahin & Nusrat',
  tagline: 'A Destined Union',
  heroSubtitle: 'Two families. One blessing. A lifetime.',

  heroImage: '/wedding-hero.jpg',
  groomPhoto: '',
  bridePhoto: '',
  showCouplePhotos: true,

  story: [
    {
      day: '08',
      fullDate: '08 Feb 2026',
      title: 'The First Meeting',
      body: 'Two families gathered beneath the old banyan tree. Tea was poured. Prayers were whispered. Strangers became kin.',
    },
    {
      day: '10',
      fullDate: '10 Feb 2026',
      title: 'The Agreement',
      body: 'Elders blessed our path with quiet certainty. A promise sealed not by contract — but by faith and ancestral trust.',
    },
    {
      day: '14',
      fullDate: '14 Feb 2026',
      title: 'The Union',
      body: 'Under the open village sky, with the fragrance of earth after rain, two souls became one rhythm.',
    },
  ],

  rhythmHeadline: 'Two souls. One rhythm.',
  rhythmBody: 'Every love story has its own frequency. Ours found resonance.',

  events: [
    {
      id: 'holud',
      label: 'Gaye Holud',
      arabic: 'গায়ে হলুদ',
      date: '12.02.26',
      day: 'Thursday',
      time: '4:00 PM onwards',
      description: 'The turmeric ceremony — a sacred ritual of colour, joy, and ancestral blessing.',
    },
    {
      id: 'nikah',
      label: 'Nikah',
      arabic: 'নিকাহ',
      date: '14.02.26',
      day: 'Saturday',
      time: '10:00 AM',
      description: 'The Islamic marriage contract — witnessed by family, blessed by Allah.',
    },
    {
      id: 'walima',
      label: 'Walima',
      arabic: 'ওয়ালিমা',
      date: '16.02.26',
      day: 'Monday',
      time: '1:00 PM onwards',
      description: 'The wedding feast — a celebration of union, gratitude, and community.',
    },
  ],

  venueName: "The Bride's Village Home",
  venueArea: 'Gazipur, Bangladesh',
  venueDetail: 'Kapasia, Gazipur District, Dhaka Division',
  venueMapsUrl: 'https://maps.google.com/?q=Kapasia+Gazipur+Bangladesh',

  rsvpFormspreeId: '',
  rsvpDeadline: 'January 31, 2026',
  rsvpConfirmationNote: 'May Allah bless your attendance and your household.',

  closingDua: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا',
  closingDuaTranslation: '"Our Lord, grant us righteous spouses."',
  closingDuaSource: '— Quran 25:74',

  bismillah: '﷽',
  loaderTagline: 'A Destined Union',
}

/**
 * Deep merge incoming partial wedding config over the defaults.
 * Ensures story[] and events[] arrays are merged element-by-element
 * so partial edits (e.g. only changing a title) don't wipe other fields.
 */
export function mergeWeddingConfig(saved: Partial<WeddingConfig>): WeddingConfig {
  const merged: WeddingConfig = { ...DEFAULT_WEDDING_CONFIG, ...saved }

  // Merge story items
  if (saved.story?.length) {
    merged.story = DEFAULT_WEDDING_CONFIG.story.map((def, i) => ({
      ...def,
      ...(saved.story![i] ?? {}),
    }))
  }

  // Merge event items
  if (saved.events?.length) {
    merged.events = DEFAULT_WEDDING_CONFIG.events.map((def, i) => ({
      ...def,
      ...(saved.events![i] ?? {}),
    }))
  }

  return merged
}
