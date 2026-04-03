<script setup lang="ts">
import { computed, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useContentStore } from '../stores/content'
import { handleImageError, withFallback } from '../utils/media'
import { useSearchPagination } from '../composables/useSearchPagination'

const props = defineProps<{
  cid: string
}>()

const contentStore = useContentStore()
const { productList, categories } = storeToRefs(contentStore)

const baseItems = computed(() =>
  productList.value.filter((x) => String(x.cid) === props.cid || props.cid === '2'),
)

const categoryNameMap = computed(() => {
  const map = new Map<number, string>()
  for (const item of categories.value) {
    map.set(item.id, item.name)
  }
  return map
})

const productCategories = computed(() => {
  const counter = new Map<number, number>()
  for (const item of productList.value) {
    counter.set(item.cid, (counter.get(item.cid) ?? 0) + 1)
  }

  const ids = Array.from(counter.keys())
  const scoped = ids
    .map((id) => ({
    id,
    name: categoryNameMap.value.get(id) ?? `分类 ${id}`,
      count: counter.get(id) ?? 0,
    }))
    .filter((item) => item.id !== 2)
    .sort((a, b) => b.count - a.count || a.id - b.id)

  return [{ id: 2, name: '全部产品', count: productList.value.length }, ...scoped]
})

const currentCategoryName = computed(() => {
  if (props.cid === '2') return '全部产品'
  const cid = Number.parseInt(props.cid, 10)
  return categoryNameMap.value.get(cid) ?? `分类 ${props.cid}`
})

const {
  keyword,
  currentPage,
  selectedPageSize,
  pageSizeOptions,
  selectedSort,
  sortOptions,
  hasActiveFilters,
  filteredItems,
  totalPages,
  pagerTokens,
  pagedItems,
  resetPage,
  resetAll,
} =
  useSearchPagination({
    pageSize: 8,
    pageSizeOptions: [8, 16, 32],
    source: baseItems,
    searchOf: (item) => `${item.title} ${item.summary}`,
    sortOptions: [
      {
        value: 'newest',
        label: '最新上架',
        compare: (a, b) => b.id - a.id,
      },
      {
        value: 'oldest',
        label: '最早上架',
        compare: (a, b) => a.id - b.id,
      },
      {
        value: 'title-asc',
        label: '名称 A-Z',
        compare: (a, b) => a.title.localeCompare(b.title, 'zh-CN'),
      },
    ],
    defaultSort: 'newest',
  })

function splitHighlight(text: string) {
  const q = keyword.value.trim()

  if (!q) {
    return [{ text, match: false }]
  }

  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'ig')
  const chunks = text.split(regex)

  return chunks
    .filter((chunk) => chunk.length > 0)
    .map((chunk) => ({ text: chunk, match: chunk.toLowerCase() === q.toLowerCase() }))
}

watch(
  () => props.cid,
  () => {
    resetPage()
  },
)

const items = computed(() => pagedItems.value)
const selectedSortLabel = computed(
  () => sortOptions.find((x) => x.value === selectedSort.value)?.label ?? '默认排序',
)

const activeChips = computed(() => {
  const chips: string[] = []

  if (keyword.value.trim()) {
    chips.push(`关键词: ${keyword.value.trim()}`)
  }

  chips.push(`排序: ${selectedSortLabel.value}`)
  chips.push(`每页: ${selectedPageSize.value} 条`)

  return chips
})

const hasRawItems = computed(() => baseItems.value.length > 0)
</script>

<template>
  <section class="panel crumb-panel">
    <p class="crumbs">
      <RouterLink to="/">首页</RouterLink>
      <span>/</span>
      <RouterLink to="/products/2">产品展示</RouterLink>
      <span>/</span>
      <strong>{{ currentCategoryName }}</strong>
    </p>
  </section>

  <section class="split-layout">
    <aside class="panel side-panel">
      <h3>产品分类</h3>
      <nav class="side-nav">
        <RouterLink
          v-for="cat in productCategories"
          :key="cat.id"
          :to="`/products/${cat.id}`"
          class="side-link"
          :class="{ active: String(cat.id) === props.cid }"
        >
          <span class="side-name">{{ cat.name }}</span>
          <span class="side-count">{{ cat.count }}</span>
        </RouterLink>
      </nav>
    </aside>

    <div class="split-main">
      <section class="panel bg-white/95">
        <h2>产品列表</h2>
        <p class="text-sm text-slate-500">当前分类：{{ currentCategoryName }}</p>
        <div class="list-tools">
          <input
            v-model.trim="keyword"
            class="search-input"
            type="search"
            placeholder="输入产品关键词"
          />
          <div class="filters-row">
            <label class="filter-label">
              排序
              <select v-model="selectedSort" class="filter-select">
                <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </label>
            <label class="filter-label">
              每页
              <select v-model.number="selectedPageSize" class="filter-select">
                <option v-for="size in pageSizeOptions" :key="`size-${size}`" :value="size">
                  {{ size }} 条
                </option>
              </select>
            </label>
            <button type="button" class="filter-reset" :disabled="!hasActiveFilters" @click="resetAll()">
              重置筛选
            </button>
          </div>
          <div class="chip-row">
            <span v-for="chip in activeChips" :key="chip" class="chip">{{ chip }}</span>
          </div>
          <p class="result-tip">共 {{ filteredItems.length }} 条，当前第 {{ currentPage }} / {{ totalPages }} 页</p>
        </div>
      </section>

      <section class="panel" v-if="items.length">
        <div class="product-cards">
          <article v-for="item in items" :key="item.id" class="product-card group overflow-hidden">
            <img
              v-if="item.cover"
              class="card-cover transition-transform duration-500 group-hover:scale-[1.02]"
              :src="withFallback(item.cover, item.title)"
              :alt="item.title"
              loading="lazy"
              @error="handleImageError($event, item.title)"
            />
            <div v-else class="thumb">{{ item.title.slice(0, 2) }}</div>
            <div class="flex items-center justify-between gap-3 text-xs text-slate-500">
              <span class="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">{{ currentCategoryName }}</span>
              <span>#{{ item.id }}</span>
            </div>
            <h3 class="text-lg leading-7 text-slate-800 transition-colors duration-200 group-hover:text-emerald-700">
              <template v-for="(chunk, idx) in splitHighlight(item.title)" :key="`title-${item.id}-${idx}`">
                <mark v-if="chunk.match" class="hl">{{ chunk.text }}</mark>
                <span v-else>{{ chunk.text }}</span>
              </template>
            </h3>
            <p class="line-clamp-3 text-sm leading-7 text-slate-600">
              <template
                v-for="(chunk, idx) in splitHighlight(item.summary)"
                :key="`summary-${item.id}-${idx}`"
              >
                <mark v-if="chunk.match" class="hl">{{ chunk.text }}</mark>
                <span v-else>{{ chunk.text }}</span>
              </template>
            </p>
            <div class="mt-auto flex items-center justify-between gap-3 pt-2">
              <span class="text-xs text-slate-400">查看详情与图集</span>
              <RouterLink
                :to="`/products/${item.cid}/${item.id}`"
                class="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-emerald-700"
              >
                查看详情
              </RouterLink>
            </div>
          </article>
        </div>
        <div class="pager">
          <button type="button" class="pager-btn" :disabled="currentPage === 1" @click="currentPage -= 1">
            上一页
          </button>
          <button
            v-for="(token, index) in pagerTokens"
            :key="`product-page-${token}-${index}`"
            type="button"
            class="pager-btn"
            :class="{ active: token === currentPage, dots: token === '...' }"
            :disabled="token === '...'"
            @click="token !== '...' && (currentPage = token)"
          >
            {{ token }}
          </button>
          <button
            type="button"
            class="pager-btn"
            :disabled="currentPage === totalPages"
            @click="currentPage += 1"
          >
            下一页
          </button>
        </div>
      </section>

      <section class="panel empty-panel" v-else>
        <p v-if="hasRawItems">当前筛选条件下暂无结果，请尝试调整关键词或重置筛选。</p>
        <p v-else>该分类下暂无产品。</p>
        <button v-if="hasRawItems" type="button" class="empty-action" @click="resetAll()">清空筛选</button>
      </section>
    </div>
  </section>
</template>
