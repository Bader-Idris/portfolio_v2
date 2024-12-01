import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'

import App from '@/App.vue'
import router, { isElectron } from '@/router'
import AppLink from '@/components/AppLink.vue'
import CustomButtons from '@/components/CustomButtons.vue'
import TheNavigation from '@/components/TheNavigation.vue'
import { App as CapacitorApp } from '@capacitor/app'
import { Toast } from '@capacitor/toast'
import { StatusBar, Style } from '@capacitor/status-bar'
import { Device } from '@capacitor/device'
import { Network } from '@capacitor/network'

// Import notification service
import {
  registerPushNotifications,
  scheduleWelcomeNotification
} from '@/services/notificationService'

import '@/assets/css/normalize.css'
import '@/assets/css/fontawesome.min.css'

//! remove these

// Add API key defined in contextBridge to window object type
declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    mainApi?: any
  }
}
//! remove these

// Offline notification function
async function notifyOffline() {
  if (isElectron()) {
    // Electron native notification
    await new Notification('Offline', {
      body: 'You are currently offline. Please check your connection.'
    })
  } else {
    // Capacitor Toast notification
    await Toast.show({
      text: 'You are offline. Check your connection.',
      duration: 'long',
      position: 'bottom'
    })
  }
}

async function initializeApp() {
  try {
    const deviceInfo = await Device.getInfo()
    const isPC = deviceInfo.platform === 'web' && !deviceInfo.isVirtual

    const app = createApp(App)
    app.component('AppLink', AppLink)
    app.component('CustomButtons', CustomButtons) // set as a global component
    app.component('TheNavigation', TheNavigation)

    const head = createHead()
    app.use(head)
    app.use(router).use(createPinia())

    app.mount('#app').$nextTick(() => {
      // for preload loading scripts, TODO: place lottie styles instead!!
      postMessage({ payload: 'useLoading' }, '*')
    })

    if (!isPC && !isElectron()) {
      // Change the status bar style
      StatusBar.setStyle({ style: Style.Dark })
      StatusBar.setBackgroundColor({ color: '#01080E' })

      if (deviceInfo.platform === 'android') {
        document.body.requestFullscreen()
      }

      // Register notifications
      await registerNotifications()
    }

    // Add network status listener for offline detection
    Network.addListener('networkStatusChange', async (status) => {
      if (!status.connected) {
        await notifyOffline()
      }
    })

    // Initial offline check on startup
    const status = await Network.getStatus()
    if (!status.connected) {
      await notifyOffline()
    }

    let lastBackPressed = 0
    CapacitorApp.addListener('backButton', async ({ canGoBack }) => {
      if (!canGoBack && router.currentRoute.value.path === '/') {
        const currentTime = new Date().getTime()

        if (currentTime - lastBackPressed < 2000) {
          if (isElectron()) {
            const { app } = require('@electron/remote')
            app.quit()
          } else {
            CapacitorApp.exitApp()
          }
        } else {
          lastBackPressed = currentTime
          await Toast.show({
            text: 'Press back again to exit',
            duration: 'short', // The toast will disappear quickly
            position: 'bottom'
          })
        }
      } else {
        router.go(-1)
      }
    })
  } catch (error) {
    console.error('Error initializing the app:', error)
  }
}

// Separate async function for notification registration
async function registerNotifications() {
  try {
    await registerPushNotifications()
    await scheduleWelcomeNotification()
  } catch (error) {
    console.error('Notification registration failed: ', error)
  }
}

initializeApp()
