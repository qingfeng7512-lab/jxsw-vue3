<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useContentStore } from '../stores/content'

const contentStore = useContentStore()
const { aboutText } = storeToRefs(contentStore)
</script>

<template>
  <section class="panel overflow-hidden bg-gradient-to-br from-white via-amber-50/70 to-emerald-50/60">
    <div class="grid gap-6 lg:grid-cols-[1.4fr_0.9fr] lg:items-start">
      <div>
        <p class="tag">关于我们</p>
        <h2 class="text-3xl md:text-4xl">把开锁和锁具服务，做成更容易信任的一件事</h2>
        <p class="mt-4 text-base leading-8 text-slate-600">{{ aboutText }}</p>
      </div>
      <div class="grid gap-3">
        <div class="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
          <p class="text-xs uppercase tracking-[0.14em] text-emerald-700/70">服务原则</p>
          <p class="mt-2 text-sm text-slate-600">先说明、再处理；先确认、再施工。把每一步讲清楚，让用户放心。</p>
        </div>
        <div class="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
          <p class="text-xs uppercase tracking-[0.14em] text-amber-700/80">适用场景</p>
          <p class="mt-2 text-sm text-slate-600">家庭门锁、商铺门锁、智能门锁安装与常规维护，尽量保持流程简洁温和。</p>
        </div>
      </div>
    </div>
  </section>

  <section class="panel-grid">
    <article class="panel hover-lift">
      <h3>专业能力</h3>
      <p>开锁、换锁、修锁、智能锁安装与维护一体化服务。</p>
    </article>
    <article class="panel hover-lift">
      <h3>服务流程</h3>
      <p>核验需求、现场评估、规范施工、结果确认，过程透明可追溯。</p>
    </article>
    <article class="panel hover-lift">
      <h3>服务时段</h3>
      <p>全年无休，支持紧急上门与预约时段服务。</p>
    </article>
  </section>

  <section class="grid gap-4 lg:grid-cols-2">
    <article class="panel bg-white/90">
      <p class="tag">我们重视的体验</p>
      <ul class="m-0 grid gap-3 p-0 text-sm text-slate-600">
        <li class="list-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">不过度制造紧迫感，先帮助你判断问题类型。</li>
        <li class="list-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">尽量用容易理解的语言解释锁具更换与维护建议。</li>
        <li class="list-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">把“上门服务”做成更可预期的过程，而不是只能被动等待。</li>
      </ul>
    </article>
    <article class="panel bg-gradient-to-br from-emerald-50 to-white">
      <p class="tag">为什么做这次前端升级</p>
      <p class="text-base text-slate-600">
        新版界面强调清晰、温和和可信，让内容展示、分类查找、服务了解都更接近日常用户的浏览习惯。
      </p>
      <div class="mt-4 flex flex-wrap gap-2">
        <span class="rounded-full bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">信息更清晰</span>
        <span class="rounded-full bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">分类更好找</span>
        <span class="rounded-full bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">视觉更亲和</span>
      </div>
    </article>
  </section>
</template>
