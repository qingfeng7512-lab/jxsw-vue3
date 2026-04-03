<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useContentStore } from '../stores/content'

const props = defineProps<{
  cid: string
  id: string
}>()

const contentStore = useContentStore()
const { newsList, categories } = storeToRefs(contentStore)

const detail = computed(() => newsList.value.find((x) => String(x.id) === props.id))
const currentCategoryName = computed(() => {
  const cid = Number.parseInt(props.cid, 10)
  return categories.value.find((x) => x.id === cid)?.name ?? `分类 ${props.cid}`
})

const siblings = computed(() =>
  newsList.value.filter((x) => String(x.cid) === props.cid).sort((a, b) => a.id - b.id),
)

const currentIndex = computed(() => siblings.value.findIndex((x) => String(x.id) === props.id))
const prevItem = computed(() => (currentIndex.value > 0 ? siblings.value[currentIndex.value - 1] : null))
const nextItem = computed(() =>
  currentIndex.value >= 0 && currentIndex.value < siblings.value.length - 1
    ? siblings.value[currentIndex.value + 1]
    : null,
)

const relatedItems = computed(() =>
  siblings.value
    .filter((item) => String(item.id) !== props.id)
    .slice()
    .sort((a, b) => b.hits - a.hits || b.id - a.id)
    .slice(0, 3),
)
</script>

<template>
  <section class="panel crumb-panel">
    <p class="crumbs">
      <RouterLink to="/">首页</RouterLink>
      <span>/</span>
      <RouterLink to="/news/3">新闻资讯</RouterLink>
      <span>/</span>
      <RouterLink :to="`/news/${props.cid}`">{{ currentCategoryName }}</RouterLink>
      <span>/</span>
      <strong>{{ detail?.title || '详情' }}</strong>
    </p>
  </section>

  <section class="panel" v-if="detail">
    <div class="rounded-2xl bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-5">
      <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span class="rounded-full bg-white px-2.5 py-1 text-emerald-700 shadow-sm">{{ currentCategoryName }}</span>
        <span>{{ detail.date }}</span>
        <span>浏览 {{ detail.hits }}</span>
      </div>
      <h2 class="mt-4 text-3xl leading-tight md:text-4xl">{{ detail.title }}</h2>
      <p class="mt-4 text-sm leading-8 text-slate-600">{{ detail.summary }}</p>
    </div>
    <div class="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
      <p class="whitespace-pre-line text-[15px] leading-8 text-slate-600">{{ detail.content }}</p>
    </div>
  </section>

  <section class="panel" v-if="detail">
    <div class="detail-nav md:grid-cols-2">
      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs uppercase tracking-[0.12em] text-slate-400">上一篇</p>
        <RouterLink v-if="prevItem" :to="`/news/${prevItem.cid}/${prevItem.id}`" class="mt-2 block text-base">
          {{ prevItem.title }}
        </RouterLink>
        <span v-else class="mt-2 block text-sm text-slate-400">没有了</span>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs uppercase tracking-[0.12em] text-slate-400">下一篇</p>
        <RouterLink v-if="nextItem" :to="`/news/${nextItem.cid}/${nextItem.id}`" class="mt-2 block text-base">
          {{ nextItem.title }}
        </RouterLink>
        <span v-else class="mt-2 block text-sm text-slate-400">没有了</span>
      </div>
    </div>
  </section>

  <section class="panel" v-if="detail && relatedItems.length">
    <div class="section-head">
      <h3>相关推荐</h3>
      <RouterLink :to="`/news/${props.cid}`">返回分类列表</RouterLink>
    </div>
    <div class="news-cards">
      <article v-for="item in relatedItems" :key="item.id" class="news-card hover-lift">
        <p class="time">{{ item.date }} · 浏览 {{ item.hits }}</p>
        <h4>{{ item.title }}</h4>
        <p class="line-clamp-3">{{ item.summary }}</p>
        <RouterLink :to="`/news/${item.cid}/${item.id}`">继续阅读</RouterLink>
      </article>
    </div>
  </section>

  <section class="panel" v-else>
    <p>未找到该新闻。</p>
  </section>
</template>
