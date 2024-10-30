<template>
  <!-- External link on mobile devices (uses Capacitor in-app browser) -->
  <a
    v-if="isExternalLink && isMobile"
    class="external-link"
    :href="Object(to)"
    @click.prevent="openInAppBrowser"
  >
    <slot />
  </a>

  <!-- External link for non-mobile devices (opens in a new tab) -->
  <a
    v-else-if="isExternalLink"
    v-bind="$attrs"
    class="external-link"
    :href="Object(to)"
    target="_blank"
    rel="noopener"
  >
    <slot />
  </a>

  <!-- Internal link using router-link, maintaining custom class and following documentation -->
  <router-link v-else v-slot="{ href, navigate }" v-bind="$props" custom>
    <a v-bind="$attrs" class="internal-link" :href="href" @click="navigate">
      <slot />
    </a>
  </router-link>
</template>

<script lang="ts" setup>
// Import necessary modules
import { computed, PropType } from 'vue'
import { RouterLink, RouteLocationRaw } from 'vue-router'
import { Browser } from '@capacitor/browser'
import { Capacitor } from '@capacitor/core'

// To ensure attributes are not inherited by default
defineOptions({
  inheritAttrs: false
})

// Define props from RouterLink
const props = defineProps({
  // Use RouteLocationRaw from vue-router for type safety
  to: {
    type: [String, Object] as PropType<RouteLocationRaw>,
    required: true
  },
  inactiveClass: {
    type: String,
    default: 'inactive'
  }
})

// Check if the link is an external URL
const isExternalLink = computed(() => {
  return typeof props.to === 'string' && props.to.startsWith('http')
})

// Check if the app is running on a mobile device using Capacitor
const isMobile = computed(() => Capacitor.isNativePlatform())

// Open the link in the in-app browser for mobile devices
const openInAppBrowser = async () => {
  if (typeof props.to === 'string') {
    await Browser.open({
      url: props.to,
      toolbarColor: '#3A65C2FF'
    })
  }
}
</script>
