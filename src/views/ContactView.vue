<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useContentStore } from '../stores/content'

const contentStore = useContentStore()
const { contactSummary, siteInfo } = storeToRefs(contentStore)
</script>

<template>
  <section class="panel overflow-hidden bg-gradient-to-br from-white via-emerald-50/60 to-amber-50/70">
    <div class="grid gap-6 lg:grid-cols-[1.3fr_0.9fr] lg:items-start">
      <div>
        <p class="tag">联系我们</p>
        <h2 class="text-3xl md:text-4xl">需要上门服务时，先把信息说清楚会更省时间</h2>
        <p class="mt-4 text-base leading-8 text-slate-600">{{ contactSummary }}</p>
      </div>
      <div class="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-sm">
        <p class="text-xs uppercase tracking-[0.14em] text-amber-700/80">预约提示</p>
        <ul class="mt-3 grid gap-3 p-0 text-sm text-slate-600">
          <li class="list-none rounded-xl bg-slate-50 px-4 py-3">说明门锁类型和问题现象，沟通会更快。</li>
          <li class="list-none rounded-xl bg-slate-50 px-4 py-3">提前确认上门地址、时间段和是否为紧急需求。</li>
          <li class="list-none rounded-xl bg-slate-50 px-4 py-3">如涉及换锁或智能锁安装，可先说明门体情况。</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="panel-grid">
    <article class="panel hover-lift bg-white/95">
      <h3>服务热线</h3>
      <p class="text-2xl font-semibold text-emerald-700">{{ siteInfo.hotline }}</p>
      <p class="mt-2 text-sm text-slate-500">适合紧急咨询、快速确认服务类型与预约时间。</p>
    </article>
    <article class="panel hover-lift bg-white/95">
      <h3>联系手机</h3>
      <p class="text-2xl font-semibold text-slate-800">{{ siteInfo.mobile }}</p>
      <p class="mt-2 text-sm text-slate-500">便于补充定位、门锁照片或上门前沟通细节。</p>
    </article>
    <article class="panel hover-lift bg-white/95">
      <h3>门店地址</h3>
      <p>{{ siteInfo.address }}</p>
      <p class="mt-2 text-sm text-slate-500">适合到店咨询、锁具选型和安装维护相关问题了解。</p>
    </article>
  </section>

  <section class="grid gap-4 lg:grid-cols-2">
    <article class="panel bg-white/90">
      <p class="tag">沟通建议</p>
      <div class="grid gap-3">
        <div class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          家庭场景：可以先描述门锁打不开、钥匙断裂、换锁升级等具体问题。
        </div>
        <div class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          商铺场景：建议提前说明门型、营业时间与是否需要尽量减少停业影响。
        </div>
      </div>
    </article>
    <article class="panel bg-gradient-to-br from-amber-50 to-white">
      <p class="tag">服务氛围</p>
      <p class="text-base text-slate-600">
        新版联系页尽量减少“紧急压迫感”，用更平和的方式组织信息，让用户在真正需要帮助时也能快速找到重点。
      </p>
      <div class="mt-4 flex flex-wrap gap-2">
        <span class="rounded-full bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">先沟通后安排</span>
        <span class="rounded-full bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">信息更直观</span>
        <span class="rounded-full bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">页面更亲和</span>
      </div>
    </article>
  </section>
</template>
