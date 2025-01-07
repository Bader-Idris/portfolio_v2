import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { useHead } from '@vueuse/head'
import HomeView from '@/views/HomeView.vue'
import { App, URLOpenListenerEvent } from '@capacitor/app'
// https://capacitorjs.com/docs/guides/deep-links#vue
// it requires modifying some configs on both ios and android

import { useUserStore } from '@/stores/UserNameStore'

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
      title: 'Bader Idris - Full-Stack Developer Portfolio', // how to get the one in the index.html file for this and its description and what's title.main
      description:
        "Explore Bader Idris's portfolio showcasing skills in modern web development technologies, including Vue, Node.js, and more.",
      contentSecurityPolicy: `
        default-src 'self' https: ws: wss: blob: data: 'unsafe-inline';
        img-src 'self' https://raw.githubusercontent.com data:;
        connect-src 'self' https://baderidris.com ws: wss:;
      `
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: {
      title: 'Register Bader Idris - Full-Stack Developer Portfolio',
      description: 'Create an account on My Website.'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      title: 'Login Bader Idris - Full-Stack Developer Portfolio',
      description: 'Create an account on My Website.'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: {
      title: 'Bader Idris - Full-Stack Developer & Innovative Tech Creator',
      description:
        "Discover Bader Idris, a versatile full-stack developer excelling in web development, backend systems, DevOps, and cross-platform applications. With expertise in Vue.js, Node.js, Docker, and more, let's transform ideas into impactful solutions."
    }
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/views/ProjectsView.vue'),
    meta: {
      title: 'Bader Idris Projects - Innovative Full-Stack Developer Portfolio',
      description:
        'Explore projects by Bader Idris, showcasing expertise in responsive web design, e-commerce, multi-step forms, todo apps, and stunning agency web apps. Powered by Vue.js, TypeScript, Node.js, and more.'
    }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/ContactView.vue'),
    meta: {
      title: 'Get in Touch with Bader Idris - Full-Stack Developer & Tech Innovator',
      description:
        "Reach out to Bader Idris for collaboration, queries, or opportunities. Available via email, LinkedIn, GitHub, and more. Let's build something amazing together!"
    },
    children: [
      {
        path: 'admin',
        name: 'contact-admin',
        component: () => import('@/components/ContactAdmin.vue'),
        meta: { requiresAdmin: true }
      }
    ]
  },
  {
    path: '/user/verify-email',
    name: 'verifyEmail',
    component: () => import('@/components/VerifyEmail.vue'),
    meta: {
      title: 'verify email Bader Idris - Full-Stack Developer Portfolio',
      description: 'verify email sent by Bader Idris'
    },
    // Map route query parameters to props with TypeScript typing
    props: (route) => ({
      token: route.query.token as string,
      email: route.query.email as string
    })
  },
  {
    path: '/user/reset-password',
    name: 'resetPassword',
    component: () => import('@/components/resetPassword.vue'),
    meta: {
      title: 'reset your password after requesting it using email',
      description: 'reset email sent by Bader Idris'
    },
    props: (route) => ({
      token: route.query.token as string,
      email: route.query.email as string
    })
  },
  {
    path: '/user/forgot-password',
    name: 'forgotPassword',
    component: () => import('@/components/forgotPassword.vue'),
    meta: {
      title: 'forgot password page',
      description: 'add your email to reset your password'
    }
  },
  {
    path: '/protected',
    name: 'protected',
    component: () => import('@/views/ProtectedView.vue'),
    meta: {
      title: 'protected page',
      description: 'exclusive for logged in users'
    }
  },
  // @ts-ignore
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: '404 page Bader Idris - Full-Stack Developer Portfolio',
      description: 'this page does not exist'
    },
    redirect: isElectron() ? '/' : undefined
  }
]

// Use different history modes depending on the environment
const router = createRouter({
  history: isElectron() ? createWebHashHistory() : createWebHistory(import.meta.env.BASE_URL),
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
    // put this underneath imports // const language = ref('en'); // Default language (can be replaced with Pinia)
    // ,htmlAttrs: {
    //   lang: language.value
    // }
  })

  const authStore = useUserStore()

  if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    return next('/login') // Redirect non-admin users to login
  }
  // redirect them after they log in to the link they were trying to go to

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
