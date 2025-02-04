import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { useHead } from '@vueuse/head'
import i18n, { loadLocaleMessages } from '@/i18n'
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

const getDefaultLanguage = (): string => {
  const browserLang = navigator.language.split('-')[0]
  return ['en', 'ar', 'es'].includes(browserLang) ? browserLang : 'en'
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    // path: '/:lang(en|ar|es)?', // Optional language prefix
    component: HomeView,
    meta: {
      title: 'Bader Idris - Full-Stack Developer Portfolio', // how to get the one in the index.html file for this and its description and what's title.main
      description:
        "Explore Bader Idris's portfolio as a full-stack developer specializing in Vue, Node.js, and modern web technologies. Crafting responsive, dynamic web experiences.",
      contentSecurityPolicy: `
        default-src 'self' https: ws: wss: blob: data: 'unsafe-inline';
        img-src 'self' https://raw.githubusercontent.com data:;
        connect-src 'self' https://baderidris.com ws: wss:;
      `,
      pathKey: 'home' // Corresponds to the JSON file name
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: {
      title: 'Register Bader Idris - Full-Stack Developer Portfolio',
      description:
        "Sign up on Bader Idris's platform to access exclusive content, resources, and services. Join a tech-savvy community led by a skilled full-stack developer.",
      hideLayout: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      title: 'Login Bader Idris - Full-Stack Developer Portfolio',
      description:
        "Log in to Bader Idris's portfolio platform to explore projects, insights, and opportunities. Your gateway to cutting-edge web and multi-platform solutions."
    }
  },
  {
    path: '/about',
    // path: '/:lang(en|ar|es)/about', and so on
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: {
      title: 'Bader Idris - Full-Stack Developer & Innovative Tech Creator',
      description:
        'Meet Bader Idris, a skilled full-stack developer excelling in web and app development with Vue.js, Node.js, and more. Turning ideas into innovative digital solutions.',
      pathKey: 'about'
    },
    children: [
      {
        path: 'professional',
        name: 'professionalInfo',
        component: () => import('@/components/about/ProfessionalInfo.vue'),
        meta: {
          title: 'professional page, certifications and careers',
          description: 'under development'
        }
      },
      {
        path: 'personal',
        name: 'personalInfo',
        component: () => import('@/components/about/PersonalInfo.vue'),
        meta: {
          title: 'Bader Idris - Full-Stack Developer & Innovative Tech Creator',
          description:
            'Meet Bader Idris, a skilled full-stack developer excelling in web and app development with Vue.js, Node.js, and more. Turning ideas into innovative digital solutions.'
        }
      },
      {
        path: 'hobbies',
        name: 'hobbiesInfo',
        component: () => import('@/components/about/HobbiesInfo.vue'),
        meta: {
          title: 'hobbies',
          description: 'under development'
        }
      }
    ]
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/views/ProjectsView.vue'),
    meta: {
      title: 'Bader Idris Projects - Innovative Full-Stack Developer Portfolio',
      description:
        'Explore projects by Bader Idris, showcasing expertise in responsive web design, e-commerce, multi-step forms, todo apps, and stunning agency web apps. Powered by Vue.js, TypeScript, Node.js, and more.',
      pathKey: 'projects'
    }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/ContactView.vue'),
    meta: {
      title: 'Get in Touch with Bader Idris - Full-Stack Developer & Tech Innovator',
      description:
        'Connect with Bader Idris for collaborations or tech innovations. Reach out via email, LinkedIn, or GitHub to bring your ideas to life with a full-stack expert.',
      contentSecurityPolicy:
        "default-src 'self' https://baderidris.com; connect-src 'self' https://baderidris.com; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline';",
      pathKey: 'contact'
    },
    children: [
      {
        path: 'admin',
        name: 'contact-admin',
        component: () => import('@/components/ContactAdmin.vue'),
        meta: {
          requiresAdmin: true,
          pathKey: 'admin'
        }
      }
    ]
  },
  {
    path: '/user/verify-email',
    name: 'verifyEmail',
    component: () => import('@/components/VerifyEmail.vue'),
    meta: {
      title: 'verify email Bader Idris - Full-Stack Developer Portfolio',
      description:
        'Verify your email with Bader Idris to activate your account and start exploring innovative full-stack development projects and multi-platform solutions.'
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
      description:
        "Reset your password securely via Bader Idris's platform. A safe and reliable process for accessing your account in a tech-driven ecosystem."
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
      description:
        "Forgot your password? Enter your email to reset it securely and regain access to Bader Idris's portfolio and exclusive development resources."
    }
  },
  {
    path: '/protected',
    name: 'protected',
    component: () => import('@/views/ProtectedView.vue'),
    meta: {
      title: 'protected page',
      description:
        "Access exclusive content designed for logged-in users. Bader Idris's platform offers a secure, personalized experience for tech enthusiasts.",
      pathKey: 'protected'
    }
  },
  // @ts-ignore
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: '404 page Bader Idris - Full-Stack Developer Portfolio',
      description:
        "The page you’re looking for doesn’t exist. Navigate back to Bader Idris's portfolio for innovative web solutions and development expertise."
    },
    redirect: isElectron() ? '/' : undefined
  }
]

// Use different history modes depending on the environment
const router = createRouter({
  history: isElectron() ? createWebHashHistory() : createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  // const lang = (to.params.lang as string) || getDefaultLanguage()
  const lang = getDefaultLanguage() // Use default language without URL param
  const pathKey = to.meta.pathKey as string

  if (!['en', 'ar', 'es'].includes(lang)) {
    return next(`/${getDefaultLanguage()}`)
  }

  if (lang !== i18n.global.locale || !i18n.global.getLocaleMessage(lang)[pathKey]) {
    await loadLocaleMessages(lang, pathKey)
  }

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

  const authStore = useUserStore()

  if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    return next('/login') // Redirect non-admin users to login
  }

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
