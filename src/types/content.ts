export type NewsItem = {
  id: number
  cid: number
  title: string
  summary: string
  content: string
  date: string
  hits: number
}

export type ProductItem = {
  id: number
  cid: number
  title: string
  summary: string
  cover: string
  gallery: string[]
  content: string
}

export type CategoryItem = {
  id: number
  name: string
}

export type BannerItem = {
  title: string
  subtitle: string
}

export type SiteInfo = {
  name: string
  hotline: string
  mobile: string
  address: string
}

export type ContentMeta = {
  source: string
  generatedAt: string
  sqlFile: string
  recordCounts: {
    news: number
    products: number
    banners: number
  }
}

export type ContentPayload = {
  contentMeta: ContentMeta
  siteInfo: SiteInfo
  quickNotices: string[]
  banners: BannerItem[]
  categories: CategoryItem[]
  newsList: NewsItem[]
  productList: ProductItem[]
  aboutText: string
  contactSummary: string
}
