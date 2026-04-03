import type { ContentPayload } from '../types/content'

export async function fetchContentPayload(): Promise<ContentPayload> {
  const response = await fetch('/data/content.json', {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to load content.json: ${response.status}`)
  }

  const payload = (await response.json()) as Partial<ContentPayload>

  return {
    contentMeta: payload.contentMeta ?? {
      source: 'json-no-meta',
      generatedAt: new Date().toISOString(),
      sqlFile: 'unknown',
      recordCounts: {
        news: payload.newsList?.length ?? 0,
        products: payload.productList?.length ?? 0,
        banners: payload.banners?.length ?? 0,
      },
    },
    siteInfo: payload.siteInfo!,
    quickNotices: payload.quickNotices ?? [],
    banners: payload.banners ?? [],
    categories: payload.categories ?? [],
    newsList: payload.newsList ?? [],
    productList: payload.productList ?? [],
    aboutText: payload.aboutText ?? '',
    contactSummary: payload.contactSummary ?? '',
  }
}
