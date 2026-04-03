import { defineStore } from 'pinia'
import { fallbackContent } from '../data/content'
import { fetchContentPayload } from '../services/contentApi'
import type { ContentPayload } from '../types/content'

type ContentState = ContentPayload & {
  loading: boolean
  loaded: boolean
  loadError: string | null
}

export const useContentStore = defineStore('content', {
  state: (): ContentState => ({
    ...fallbackContent,
    loading: false,
    loaded: false,
    loadError: null,
  }),
  actions: {
    async loadContent(force = false) {
      if (this.loaded && !force) return

      this.loading = true
      this.loadError = null

      try {
        const payload = await fetchContentPayload()
        this.contentMeta = payload.contentMeta ?? this.contentMeta
        this.siteInfo = payload.siteInfo
        this.quickNotices = payload.quickNotices
        this.banners = payload.banners
        this.categories = payload.categories
        this.newsList = payload.newsList
        this.productList = payload.productList
        this.aboutText = payload.aboutText
        this.contactSummary = payload.contactSummary
        this.loaded = true
      } catch (error) {
        this.loadError = error instanceof Error ? error.message : 'Unknown content loading error'
      } finally {
        this.loading = false
      }
    },
  },
})
