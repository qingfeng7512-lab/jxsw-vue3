import { createRouter, createWebHistory } from 'vue-router'

import AboutView from '../views/AboutView.vue'
import ContactView from '../views/ContactView.vue'
import HomeView from '../views/HomeView.vue'
import NewsDetailView from '../views/NewsDetailView.vue'
import NewsListView from '../views/NewsListView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import ProductListView from '../views/ProductListView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/about', name: 'about', component: AboutView },
  { path: '/contact', name: 'contact', component: ContactView },
  { path: '/news/:cid', name: 'news-list', component: NewsListView, props: true },
  {
    path: '/news/:cid/:id',
    name: 'news-detail',
    component: NewsDetailView,
    props: true,
  },
  {
    path: '/products/:cid',
    name: 'products-list',
    component: ProductListView,
    props: true,
  },
  {
    path: '/products/:cid/:id',
    name: 'products-detail',
    component: ProductDetailView,
    props: true,
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
