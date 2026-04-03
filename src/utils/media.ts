export function resolveMediaUrl(input: string): string {
  const raw = input.trim()

  if (!raw) {
    return ''
  }

  if (/^(https?:|data:|blob:)/i.test(raw)) {
    return raw
  }

  if (raw.startsWith('//')) {
    return `${window.location.protocol}${raw}`
  }

  const normalized = raw
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/^\.\.\//, '')

  return normalized.startsWith('/') ? normalized : `/${normalized}`
}

export function fallbackImageDataUri(label = 'LOCK'): string {
  const text = encodeURIComponent(label.slice(0, 18))
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#1f7466" offset="0"/><stop stop-color="#c1461f" offset="1"/></linearGradient></defs><rect width="640" height="420" fill="url(#g)"/><circle cx="120" cy="90" r="80" fill="rgba(255,255,255,0.15)"/><circle cx="570" cy="360" r="120" fill="rgba(255,255,255,0.12)"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="40" font-family="Segoe UI, Arial, sans-serif">${text}</text></svg>`
  return `data:image/svg+xml;utf8,${svg}`
}

export function withFallback(src: string, label?: string): string {
  return src ? resolveMediaUrl(src) : fallbackImageDataUri(label)
}

export function handleImageError(event: Event, label?: string): void {
  const target = event.target as HTMLImageElement | null

  if (!target || target.dataset.fallbackApplied === '1') {
    return
  }

  target.dataset.fallbackApplied = '1'
  target.src = fallbackImageDataUri(label)
}