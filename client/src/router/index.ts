import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { useHead } from '@vueuse/head'
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
    component: HomeView,
    meta: {
      title: 'Home - My Website', // how to get the one in the index.html file for this and its description and what's title.main
      description: 'Welcome to the homepage of My Website!'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: {
      title: 'Register - My Website',
      description: 'Create an account on My Website.'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      title: "Login - Bader's Website",
      description: 'Create an account on My Website.'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: {
      title: "about - Bader's Website",
      description: 'about Bader Idris'
    }
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/views/ProjectsView.vue'),
    meta: {
      title: "projects - Bader's Website",
      description: 'the projects that Bader Idris has worked on and built as a full stack developer'
    }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/ContactView.vue'),
    meta: {
      title: "contact - Bader's Website",
      description: 'contact Bader Idris'
    }
  },
  {
    path: '/user/verify-email',
    name: 'verifyEmail',
    component: () => import('@/components/VerifyEmail.vue'),
    meta: {
      title: "verify email - Bader's Website",
      description: 'verify email sent by Bader Idris'
    },
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
    meta: {
      title: '404 page',
      description: 'this page does not exist'
    },
    redirect: isElectron() ? '/' : undefined
  }
]

// Use different history modes depending on the environment
const router = createRouter({
  history: isElectron() ? createWebHashHistory() : createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const { title, description } = to.meta

  useHead({
    title: title as string,
    meta: [
      {
        name: 'description',
        content: description as string
      }
    ]
  })

  next()
})

// Add deep linking functionality
App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
  const slug = event.url.split('.app').pop()
  if (slug) {
    router.push({
      path: slug
    })
  }
})

export default router
