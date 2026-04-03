<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useContentStore } from '../stores/content'
import { handleImageError, withFallback } from '../utils/media'

const contentStore = useContentStore()
const { banners, newsList, productList, siteInfo } = storeToRefs(contentStore)

const latest = computed(() => [...newsList.value].sort((a, b) => b.id - a.id).slice(0, 3))
const featuredProducts = computed(() => productList.value.slice(0, 3))
</script>

<template>
  <section class="home-grid">
    <article class="panel banner-panel relative overflow-hidden">
      <div class="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/25 blur-2xl"></div>
      <div class="absolute bottom-0 right-16 h-20 w-20 rounded-full bg-amber-200/40 blur-xl"></div>
      <p class="tag">品牌服务</p>
      <h2 class="max-w-2xl text-3xl leading-tight md:text-4xl">
        {{ banners[0]?.title || '专业开锁与锁具服务' }}
      </h2>
      <p class="mt-3 max-w-2xl text-base text-slate-600 md:text-lg">
        {{ banners[0]?.subtitle || '急您所急，24小时到达' }}，用更透明、更安心的流程把家庭与门店服务做得踏实。
      </p>
      <div class="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
        <span class="rounded-full border border-white/70 bg-white/70 px-3 py-1">上门核验身份</span>
        <span class="rounded-full border border-white/70 bg-white/70 px-3 py-1">报价清晰透明</span>
        <span class="rounded-full border border-white/70 bg-white/70 px-3 py-1">智能锁安装维护</span>
      </div>
      <div class="banner-actions">
        <RouterLink class="btn-solid" to="/contact">立即预约</RouterLink>
        <RouterLink class="btn-ghost" to="/products/2">查看产品</RouterLink>
      </div>
      <div class="mt-6 grid gap-3 sm:grid-cols-3">
        <div class="rounded-2xl border border-white/70 bg-white/75 px-4 py-3 backdrop-blur">
          <p class="text-xs uppercase tracking-[0.12em] text-slate-500">服务热线</p>
          <strong class="mt-1 block text-lg text-emerald-700">{{ siteInfo.hotline }}</strong>
        </div>
        <div class="rounded-2xl border border-white/70 bg-white/75 px-4 py-3 backdrop-blur">
          <p class="text-xs uppercase tracking-[0.12em] text-slate-500">服务区域</p>
          <strong class="mt-1 block text-lg text-slate-800">鸡西市区及周边</strong>
        </div>
        <div class="rounded-2xl border border-white/70 bg-white/75 px-4 py-3 backdrop-blur">
          <p class="text-xs uppercase tracking-[0.12em] text-slate-500">可预约项目</p>
          <strong class="mt-1 block text-lg text-slate-800">开锁 / 换锁 / 智能锁</strong>
        </div>
      </div>
    </article>

    <article class="panel metrics-panel">
      <h3>服务承诺</h3>
      <p class="mb-4 text-sm text-slate-500">把复杂问题讲清楚，把紧急需求处理稳妥，是这套服务体验的核心。</p>
      <ul class="metric-list">
        <li>
          <strong>24H</strong>
          <span>全天候响应</span>
        </li>
        <li>
          <strong>30min+</strong>
          <span>市区快速上门</span>
        </li>
        <li>
          <strong>100%</strong>
          <span>规范流程服务</span>
        </li>
      </ul>
      <p class="mini">热线：{{ siteInfo.hotline }}</p>
      <div class="mt-4 space-y-3">
        <div class="rounded-xl border border-emerald-100 bg-white/80 px-4 py-3">
          <p class="text-sm font-semibold text-slate-700">更平和的服务节奏</p>
          <p class="text-sm text-slate-500">先沟通判断，再安排上门，不夸张承诺，也不制造焦虑。</p>
        </div>
        <div class="rounded-xl border border-amber-100 bg-white/80 px-4 py-3">
          <p class="text-sm font-semibold text-slate-700">适合家庭与门店</p>
          <p class="text-sm text-slate-500">从普通门锁到指纹锁维护，都尽量保持过程直观好理解。</p>
        </div>
      </div>
    </article>
  </section>

  <section class="grid gap-4 lg:grid-cols-3">
    <article class="panel hover-lift bg-white/90">
      <p class="tag">快速响应</p>
      <h3>紧急需求也能有秩序地处理</h3>
      <p>接到电话后先确认门锁情况、上门位置与时间诉求，减少现场来回沟通成本。</p>
    </article>
    <article class="panel hover-lift bg-white/90">
      <p class="tag">透明报价</p>
      <h3>不把专业术语变成信息差</h3>
      <p>尽量用易懂的方式解释锁芯、锁体、安装方式和更换建议，让选择更安心。</p>
    </article>
    <article class="panel hover-lift bg-white/90">
      <p class="tag">后续维护</p>
      <h3>不是装完就结束</h3>
      <p>针对指纹锁、电池、门体兼容和日常保养给出简单建议，降低后续使用门槛。</p>
    </article>
  </section>

  <section class="panel">
    <div class="section-head">
      <h3>最新资讯</h3>
      <RouterLink to="/news/3">更多</RouterLink>
    </div>
    <div class="news-cards">
      <article v-for="item in latest" :key="item.id" class="news-card hover-lift">
        <p class="time">{{ item.date }}</p>
        <h4>{{ item.title }}</h4>
        <p class="line-clamp-3">{{ item.summary }}</p>
        <RouterLink :to="`/news/${item.cid}/${item.id}`">查看详情</RouterLink>
      </article>
    </div>
  </section>

  <section class="panel">
    <div class="section-head">
      <h3>精选服务</h3>
      <RouterLink to="/products/2">全部产品</RouterLink>
    </div>
    <div class="product-cards">
      <article v-for="item in featuredProducts" :key="item.id" class="product-card hover-lift">
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
        <p class="line-clamp-3">{{ item.summary || '适配常见门型与使用场景，安装维护更直观。' }}</p>
        <RouterLink :to="`/products/${item.cid}/${item.id}`">查看项目</RouterLink>
      </article>
    </div>
  </section>
</template>
