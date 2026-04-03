<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useContentStore } from '../stores/content'
import { handleImageError, withFallback } from '../utils/media'

const props = defineProps<{
  cid: string
  id: string
}>()

const contentStore = useContentStore()
const { productList, categories } = storeToRefs(contentStore)

const detail = computed(() => productList.value.find((x) => String(x.id) === props.id))
const currentCategoryName = computed(() => {
  const cid = Number.parseInt(props.cid, 10)
  if (props.cid === '2') return '全部产品'
  return categories.value.find((x) => x.id === cid)?.name ?? `分类 ${props.cid}`
})

const relatedProducts = computed(() => {
  const current = detail.value
  if (!current) {
    return []
  }

  return productList.value
    .filter((item) => item.id !== current.id && (item.cid === current.cid || props.cid === '2'))
    .slice(0, 3)
})
</script>

<template>
  <section class="panel crumb-panel">
    <p class="crumbs">
      <RouterLink to="/">首页</RouterLink>
      <span>/</span>
      <RouterLink to="/products/2">产品展示</RouterLink>
      <span>/</span>
      <RouterLink :to="`/products/${props.cid}`">{{ currentCategoryName }}</RouterLink>
      <span>/</span>
      <strong>{{ detail?.title || '详情' }}</strong>
    </p>
  </section>

  <section class="panel" v-if="detail">
    <div class="rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-5">
      <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span class="rounded-full bg-white px-2.5 py-1 text-emerald-700 shadow-sm">{{ currentCategoryName }}</span>
        <span>产品编号 #{{ detail.id }}</span>
      </div>
      <h2 class="mt-4 text-3xl leading-tight md:text-4xl">{{ detail.title }}</h2>
      <p class="mt-4 text-sm leading-8 text-slate-600">{{ detail.summary || '适合常见门型环境，兼顾日常使用与安装维护需求。' }}</p>
    </div>
    <div class="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
      <p class="whitespace-pre-line text-[15px] leading-8 text-slate-600">
        {{ detail.content || '当前产品暂未补充详细说明，可通过联系我们页面进一步咨询安装、维护和适配建议。' }}
      </p>
    </div>
  </section>

  <section class="panel" v-if="detail">
    <h3>相关图片</h3>
    <div class="gallery-grid">
      <div v-for="(img, index) in detail.gallery" :key="img + index" class="gallery-item">
        <img
          :src="withFallback(img, detail.title)"
          :alt="`${detail.title} 图片 ${index + 1}`"
          loading="lazy"
          @error="handleImageError($event, detail.title)"
        />
        <span>图片 {{ index + 1 }}</span>
      </div>
    </div>
    <div class="flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
      <p class="text-sm text-slate-500">浏览完成后，可返回当前分类继续查看其他产品。</p>
      <RouterLink
        :to="`/products/${props.cid}`"
        class="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-emerald-700"
      >
        返回列表
      </RouterLink>
    </div>
  </section>

  <section class="panel" v-if="detail && relatedProducts.length">
    <div class="section-head">
      <h3>相关产品</h3>
      <RouterLink :to="`/products/${props.cid}`">查看更多</RouterLink>
    </div>
    <div class="product-cards">
      <article v-for="item in relatedProducts" :key="item.id" class="product-card hover-lift">
        <img
          v-if="item.cover"
          class="card-cover"
          :src="withFallback(item.cover, item.title)"
          :alt="item.title"
          loading="lazy"
          @error="handleImageError($event, item.title)"
        />
        <div v-else class="thumb">{{ item.title.slice(0, 2) }}</div>
        <h4>{{ item.title }}</h4>
        <p class="line-clamp-3">{{ item.summary || '适配常见门型与安装维护需求。' }}</p>
        <RouterLink :to="`/products/${item.cid}/${item.id}`">查看详情</RouterLink>
      </article>
    </div>
  </section>

  <section class="panel" v-else>
    <p>未找到该产品。</p>
  </section>
</template>
