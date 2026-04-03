<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useContentStore } from '../stores/content'

const route = useRoute()
const mobileNavOpen = ref(false)
const contentStore = useContentStore()
const { quickNotices, siteInfo, contentMeta, loading, loadError } = storeToRefs(contentStore)

contentStore.loadContent()

const navItems = [
  { to: '/', label: '首页' },
  { to: '/about', label: '关于我们' },
  { to: '/products/2', label: '产品展示' },
  { to: '/news/3', label: '锁具常识' },
  { to: '/news/5', label: '行业新闻' },
  { to: '/contact', label: '联系我们' },
]

const pageTitle = computed(() => {
  if (route.name === 'home') return '网站首页'
  if (route.name === 'about') return '关于我们'
  if (route.name === 'contact') return '联系我们'
  if (route.name === 'news-list') return '新闻资讯'
  if (route.name === 'news-detail') return '新闻详情'
  if (route.name === 'products-list') return '产品展示'
  if (route.name === 'products-detail') return '产品详情'
  return '页面'
})

const pageSubtitle = computed(() => {
  if (route.name === 'home') return '更亲和、更清晰的锁具服务展示界面'
  if (route.name === 'about') return '了解服务方式、工作原则与整体定位'
  if (route.name === 'contact') return '快速找到联系方式与预约提示'
  if (route.name === 'news-list') return '围绕锁具常识与行业信息的内容整理'
  if (route.name === 'news-detail') return '以更易读的结构浏览资讯全文'
  if (route.name === 'products-list') return '按分类筛选适合的锁具与安装项目'
  if (route.name === 'products-detail') return '查看产品说明、图集与关联内容'
  return '浏览页面内容'
})

const noticeText = computed(() => quickNotices.value.join('  ·  '))
const generatedAtText = computed(() => {
  const raw = contentMeta.value.generatedAt
  if (!raw) return '未知时间'
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return raw
  return d.toLocaleString('zh-CN', { hour12: false })
})

watch(
  () => route.fullPath,
  () => {
    mobileNavOpen.value = false
  },
)
</script>

<template>
  <div class="site-shell">
    <div class="top-notice">
      <span>最新动态</span>
      <p>{{ noticeText }}</p>
    </div>

    <header class="site-header">
      <div class="brand">
        <p class="brand-kicker">JIXI LOCK SERVICE</p>
        <h1>{{ siteInfo.name }}</h1>
        <p class="brand-sub">{{ siteInfo.address }}</p>
      </div>

      <button
        type="button"
        class="inline-flex h-11 w-11 items-center justify-center self-start rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-200 hover:border-emerald-300 hover:text-emerald-700 md:hidden"
        @click="mobileNavOpen = !mobileNavOpen"
        :aria-expanded="mobileNavOpen"
        aria-label="切换导航菜单"
      >
        <span class="text-lg">{{ mobileNavOpen ? '×' : '≡' }}</span>
      </button>

      <div class="brand-contact">
        <p>24小时服务热线</p>
        <strong>{{ siteInfo.hotline }}</strong>
      </div>

      <nav class="main-nav hidden md:flex" aria-label="Primary Navigation">
        <RouterLink v-for="item in navItems" :key="item.to" :to="item.to">{{ item.label }}</RouterLink>
      </nav>
    </header>

    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <section v-if="mobileNavOpen" class="panel mt-3 grid gap-3 md:hidden">
        <nav class="grid gap-2" aria-label="Mobile Navigation">
          <RouterLink
            v-for="item in navItems"
            :key="`mobile-${item.to}`"
            :to="item.to"
            class="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
          >
            {{ item.label }}
          </RouterLink>
        </nav>
        <div class="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
          <p class="text-xs uppercase tracking-[0.14em] text-emerald-700/75">服务热线</p>
          <strong class="mt-2 block text-xl text-emerald-700">{{ siteInfo.hotline }}</strong>
          <p class="mt-2 text-sm text-slate-500">{{ siteInfo.address }}</p>
        </div>
      </section>
    </transition>

    <section class="hero-band">
      <p class="hero-note">VUE3 MIGRATION PREVIEW</p>
      <p class="hero-title">{{ pageTitle }}</p>
      <p class="mt-3 max-w-2xl text-sm text-emerald-50/90 md:text-base">{{ pageSubtitle }}</p>
    </section>

    <main class="content-wrap">
      <section class="panel" v-if="loading && !contentStore.loaded">
        <p>正在加载站点内容...</p>
      </section>
      <section class="panel" v-if="loadError">
        <p>数据加载失败，已回退到本地数据：{{ loadError }}</p>
      </section>
      <RouterView />
    </main>

    <footer class="site-footer">
      <p>24x7 Service | 0467-6111666 | 13555464689</p>
      <p class="meta-line">
        数据来源：{{ contentMeta.source }} | 生成时间：{{ generatedAtText }} | 新闻：
        {{ contentMeta.recordCounts.news }} 条 | 产品：{{ contentMeta.recordCounts.products }} 条
      </p>
    </footer>
  </div>
</template>
