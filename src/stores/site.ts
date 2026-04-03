import { defineStore } from 'pinia'

export const useSiteStore = defineStore('site', {
  state: () => ({
    siteName: 'LockKing',
    hotline: '0467-6111666',
    initialized: false,
  }),
  actions: {
    initialize() {
      this.initialized = true
    },
  },
})
