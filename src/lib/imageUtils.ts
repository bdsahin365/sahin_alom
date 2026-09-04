/**
 * Image Utilities for Client-Side Compression and Base64 Encoding
 * Converts user-uploaded images into optimized Base64 data URLs that can be stored
 * directly in PostgreSQL / Supabase TEXT columns without needing external cloud storage buckets.
 */

export interface CompressOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  mimeType?: 'image/jpeg' | 'image/webp' | 'image/png'
}

/**
 * Format bytes into human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Validate image file type and size
 */
export function validateImageFile(file: File, maxBytes = 15 * 1024 * 1024): { valid: boolean; error?: string } {
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Please select a valid image file (JPG, PNG, WebP, SVG, GIF).' }
  }
  if (file.size > maxBytes) {
    return { valid: false, error: `File is too large (${formatBytes(file.size)}). Max allowed is ${formatBytes(maxBytes)}.` }
  }
  return { valid: true }
}

/**
 * Compress and convert an image File to a Base64 data URL.
 * Automatically resizes large images preserving aspect ratio.
 */
export function compressAndConvertToBase64(
  file: File,
  options: CompressOptions = {}
): Promise<{ base64: string; originalSize: number; compressedSize: number }> {
  return new Promise((resolve, reject) => {
    const {
      maxWidth = 1200,
      maxHeight = 1200,
      quality = 0.82,
      mimeType = 'image/jpeg',
    } = options

    // For SVGs, read as data URL directly to preserve vector sharpness
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        resolve({
          base64: result,
          originalSize: file.size,
          compressedSize: result.length,
        })
      }
      reader.onerror = () => reject(new Error('Failed to read SVG file'))
      reader.readAsDataURL(file)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      let { width, height } = img

      // Calculate constrained dimensions preserving aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        // Fallback to direct FileReader if canvas context unavailable
        const reader = new FileReader()
        reader.onload = () => resolve({
          base64: reader.result as string,
          originalSize: file.size,
          compressedSize: (reader.result as string).length,
        })
        reader.onerror = () => reject(new Error('Failed to read image'))
        reader.readAsDataURL(file)
        return
      }

      // Draw with high quality smoothing
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      // If output is JPEG, fill white background first in case image has transparency
      if (mimeType === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, width, height)
      }

      ctx.drawImage(img, 0, 0, width, height)

      try {
        const base64 = canvas.toDataURL(mimeType, quality)
        resolve({
          base64,
          originalSize: file.size,
          compressedSize: Math.round((base64.length * 3) / 4), // Approximate binary bytes
        })
      } catch (err) {
        // Fallback to FileReader
        const reader = new FileReader()
        reader.onload = () => resolve({
          base64: reader.result as string,
          originalSize: file.size,
          compressedSize: (reader.result as string).length,
        })
        reader.onerror = () => reject(new Error('Failed to encode image to Base64'))
        reader.readAsDataURL(file)
      }
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to load image for compression'))
    }

    img.src = objectUrl
  })
}
