/**
 * Language and Typography Utility for Multilingual (Bangla / English) Blogs
 */

/**
 * Checks whether a given string contains Bengali Unicode characters (\u0980 to \u09FF)
 */
export function isBengali(text?: string | null): boolean {
  if (!text) return false
  return /[\u0980-\u09FF]/.test(text)
}

/**
 * Returns typography CSS styles tailored for Bangla or English blog titles.
 * Bangla needs Hind Siliguri, relaxed line-height (to prevent clipping top/bottom matras),
 * and normal case (no uppercase transform).
 */
export function getBlogTitleStyles(title?: string | null) {
  const bn = isBengali(title)
  return {
    fontFamily: bn ? "'Hind Siliguri', sans-serif" : "'Barlow Condensed', 'Hind Siliguri', sans-serif",
    fontWeight: bn ? 700 : 800,
    lineHeight: bn ? 1.3 : 0.95,
    textTransform: (bn ? 'none' : 'uppercase') as 'none' | 'uppercase',
    letterSpacing: bn ? '0' : '-0.01em',
  }
}

/**
 * Returns typography CSS styles for body / excerpt text.
 */
export function getBlogBodyStyles(text?: string | null) {
  const bn = isBengali(text)
  return {
    fontFamily: bn ? "'Hind Siliguri', 'Outfit', sans-serif" : "'Outfit', 'Hind Siliguri', sans-serif",
    lineHeight: bn ? 1.75 : 1.6,
  }
}
