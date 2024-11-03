import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { App, URLOpenListenerEvent } from '@capacitor/app'
// https://capacitorjs.com/docs/guides/deep-links#vue
// it requires modifying some configs on both ios and android

// Function to check if running in Electron
export function isElectron(): boolean {
  // Renderer process
  if (
    typeof window !== 'undefined' &&
    typeof window.process === 'object' &&
    // @ts-ignore
    window.process.type === 'renderer'
  ) {
    return true
  }

  // Main process
  if (
    typeof process !== 'undefined' &&
    typeof process.versions === 'object' &&
    !!process.versions.electron
  ) {
    return true
  }

  // User agent detection if nodeIntegration is set to true
  if (
    typeof navigator === 'object' &&
    typeof navigator.userAgent === 'string' &&
    navigator.userAgent.indexOf('Electron') >= 0
  ) {
    return true
  }

  return false
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: HomeView
    // meta: {
    //   titleKey: 'title.main'
    // <|cursor|>
    // }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue')
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/views/ProjectsView.vue')
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/ContactView.vue')
  },
  {
    path: '/user/verify-email',
    name: 'verifyEmail',
    component: () => import('@/components/VerifyEmail.vue'),
    // Map route query parameters to props with TypeScript typing
    props: (route) => ({
      token: route.query.token as string,
      email: route.query.email as string
    })
  },
  // @ts-ignore
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    redirect: isElectron() ? '/' : undefined
  }
]

// Add deep linking functionality
App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
  const slug = event.url.split('.app').pop()
  if (slug) {
    router.push({
      path: slug
    })
  }
})

// Use different history modes depending on the environment
const router = createRouter({
  history: isElectron() ? createWebHashHistory() : createWebHistory(),
  routes
})

export default router
