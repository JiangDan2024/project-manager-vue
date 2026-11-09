import { createRouter, createWebHistory } from 'vue-router'

import IndexView from '@/views/index.vue'

const routes = [
  {
    path: '/',
    component: IndexView,
  },
  {
    path: '/login',
    component: () => import('@/views/login.vue'),
    hidden: true,
  },
  {
    path: '/register',
    component: () => import('@/views/register.vue'),
    hidden: true,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
