import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

//公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: ':path(.*)',
        component: () => import('@/views/redirect/index.vue'),
      },
    ],
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/index.vue'),
        meta: { title: '首页', icon: 'dashboard', affix: true },
      },
    ],
  },
  // {
  //   path: '/',
  //   component: IndexView,
  // },
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

//动态路由
export const dynamicRoutes = [
  {
    // path: '',
    // component: Layout,
    // hidden: true,
    // permissions: [],
    // children: [
    //   {
    //     path: '',
    //     component: () => import('@/views'),
    //     name: '',
    //     meta: {
    //       title: '',
    //       activeMenu: '',
    //     },
    //   },
    // ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  //记录浏览器滚动位置，满足条件时自动滚动到记忆位置
  scrollBehavior(to, from, savedPosition) {
    // ...
    if (savedPosition) {
      return savedPosition
    }
    return { top: '' }
  },
})

export default router
