import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from "vue-router"
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { useUserStore } from '@/utils/userStore'
NProgress.configure({ showSpinner: false }) // NProgress Configuration
const whiteList = ['/login', '/user/register', '/user/register-result', '/user/alteration'] // no redirect whitelist

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/analysis',
  },
  {
    path: '/HomeView',
    name: 'HomeView',
    component: () => import('@/views/HomeView.vue'),
    children: [
      // {
      //   path: '/index',
      //   name: 'index',
      //   component: () => import('@/views/index/index.vue'),
      // },
      {
        path: '/analysis',
        name: 'analysis',
        component: () => import('@/views/analysis/index.vue'),
      },
      {
        path: '/dataView',
        name: 'dataView',
        component: () => import('@/views/DataView/index.vue'),
      },
      {
        path: '/specialVideo',
        name: 'specialVideo',
        component: () => import('@/views/SpecialVideo/index.vue'),
      },
      {
        path: '/constructionProgress',
        name: 'constructionProgress',
        component: () => import('@/views/DataView/constructionProgress/index.vue'),
      },
      {
        path: '/meteorologicalData',
        name: 'meteorologicalData',
        component: () => import('@/views/DataView/meteorologicalData/index.vue'),
      },
      {
        path: '/shipPosition',
        name: 'shipPosition',
        component: () => import('@/views/DataView/shipPosition/index.vue'),
      },
      {
        path: '/videoSurveillance',
        name: 'videoSurveillance',
        component: () => import('@/views/DataView/videoSurveillance/index.vue'),
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/user/login.vue'),
  },
]
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  console.log("to", to);
  console.log("from", from);
  NProgress.start() // start progress bar

  const userStore = useUserStore()
  if (userStore.getUserToken) {
    /* has token */
    if (to.path === '/login') {
      next()
      NProgress.done()
    } else {
      if (false && userStore.permissionList.length === 0) {
        try {
          const res = await userStore.getPermissionList()
          const menuData = res.result.menu;
          //console.log(res.message)
          if (menuData === null || menuData === "" || menuData === undefined) {
            return;
          }
          const redirect = decodeURIComponent(from.query.redirect || to.path)
          if (to.path === redirect) {
            // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            next({ ...to, replace: true })
          } else {
            // 跳转到目的路由
            next({ path: redirect })
          }
        } catch (error) {
          /*notification.error({
              message: '系统提示',
              description: '请求用户信息失败，请重试！'
          })*/
          await userStore.logout()
          next({ path: '/user/login', query: { redirect: to.fullPath } })
        }
      } else {
        next()
        NProgress.done()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: '/login', query: { redirect: to.fullPath } })
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
export default router
