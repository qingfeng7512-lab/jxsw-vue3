<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="panel overflow-hidden bg-gradient-to-br from-white via-amber-50/70 to-emerald-50/60">
    <div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
      <div>
        <p class="tag">404 页面未找到</p>
        <h2 class="text-4xl leading-tight md:text-5xl">这个页面可能已经移动，或者地址输入有误</h2>
        <p class="mt-4 max-w-2xl text-base leading-8 text-slate-600">
          你可以返回首页，也可以直接前往产品展示、新闻资讯或联系我们页面继续浏览。
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <RouterLink class="btn-solid" to="/">返回首页</RouterLink>
          <RouterLink class="btn-ghost" to="/products/2">查看产品</RouterLink>
          <RouterLink class="btn-ghost" to="/news/3">查看资讯</RouterLink>
        </div>
      </div>

      <div class="rounded-3xl border border-white/80 bg-white/85 p-6 shadow-sm">
        <div class="rounded-2xl bg-slate-900 px-5 py-6 text-white">
          <p class="text-xs uppercase tracking-[0.18em] text-emerald-200/80">Navigation Helper</p>
          <strong class="mt-3 block text-6xl font-semibold leading-none text-amber-300">404</strong>
          <p class="mt-4 text-sm leading-7 text-slate-200/85">建议优先从顶部导航返回，或直接使用下面的入口。</p>
        </div>
        <div class="mt-4 grid gap-2">
          <RouterLink class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700" to="/about">
            关于我们
          </RouterLink>
          <RouterLink class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700" to="/contact">
            联系我们
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
