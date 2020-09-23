import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/Layout'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login')
  },
  {
    path: '/',
    name: 'Home',
    redirect: '/dealer/data',
  },
  {
    path: '/dealer',
    name: 'Dealer',
    component: Layout,
    meta: { title: '经销商'},
    children: [
      {
        path: 'data',
        name: 'DealerData',
        component: () => import('@/views/Home'),
        meta: { title: '数据列表'},
      },
      {
        path: 'upload',
        name: 'DealerUpload',
        component: () => import('@/views/Upload')
      }
    ]
  },
  { path: '*', redirect: '/' }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
