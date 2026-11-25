/**
 * Normalizes event image URLs returned by the backend API.
 * - Treats empty strings or bare "/storage/" URLs (when DB image path is null/empty) as no image.
 * - Resolves relative paths against the backend origin derived from VITE_API_URL.
 */
export function resolveEventImageUrl(rawUrl?: string | null): string {
  if (!rawUrl || typeof rawUrl !== 'string') return ''
  const trimmed = rawUrl.trim()
  if (!trimmed) return ''

  // Detect bare storage base URLs like "http://127.0.0.1:8000/storage/" or "/storage"
  if (/\/storage\/?$/i.test(trimmed)) return ''

  // Already absolute URL or data URI
  if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith('data:')) {
    return trimmed
  }

  // Resolve relative path against backend origin
  const apiUrl = import.meta.env.VITE_API_URL || ''
  try {
    const origin = new URL(apiUrl).origin
    const cleanPath = trimmed.replace(/^\/+/, '')
    if (cleanPath.startsWith('storage/')) {
      return `${origin}/${cleanPath}`
    }
    return `${origin}/storage/${cleanPath}`
  } catch {
    return trimmed
  }
}

/**
 * Parses a backend event date ("dd/mm/yyyy", "yyyy-mm-dd", or "yyyy-mm-dd HH:mm:ss") into a local midnight Date.
 */
export function parseEventLocalDate(startDate?: string | null, startDatetime?: string | null): Date | null {
  const tryParseString = (raw?: string | null): Date | null => {
    if (!raw || typeof raw !== 'string') return null
    const datePart = raw.trim().split(' ')[0]?.split('T')[0] || ''

    if (datePart.includes('/')) {
      const parts = datePart.split('/')
      if (parts.length === 3) {
        const day = parseInt(parts[0] || '', 10)
        const month = parseInt(parts[1] || '', 10)
        const year = parseInt(parts[2] || '', 10)
        if (Number.isInteger(day) && Number.isInteger(month) && Number.isInteger(year)) {
          return new Date(year, month - 1, day)
        }
      }
    }

    if (datePart.includes('-')) {
      const parts = datePart.split('-')
      if (parts.length === 3) {
        const year = parseInt(parts[0] || '', 10)
        const month = parseInt(parts[1] || '', 10)
        const day = parseInt(parts[2] || '', 10)
        if (Number.isInteger(day) && Number.isInteger(month) && Number.isInteger(year)) {
          return new Date(year, month - 1, day)
        }
      }
    }

    return null
  }

  return tryParseString(startDate) || tryParseString(startDatetime)
}

/**
 * Returns local midnight for tomorrow (current day + 1).
 */
export function getTomorrowStart(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
}

/**
 * Returns true only for events with published status ("published" / "publicado").
 * Allows items if the backend already filtered and omitted status/is_published.
 */
export function isPublishedEvent(item: any): boolean {
  if (!item || typeof item !== 'object') return false
  if (typeof item.is_published === 'boolean') return item.is_published
  if (item.status !== undefined && item.status !== null && String(item.status).trim() !== '') {
    const normalized = String(item.status).trim().toLowerCase()
    return normalized === 'published' || normalized === 'publicado'
  }
  return true
}
