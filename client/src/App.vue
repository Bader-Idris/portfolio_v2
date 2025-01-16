<template>
  <!-- <TheUtils /> -->
  <!-- Conditionally render TheNavigation and FooterComp based on the route meta -->
  <!-- also you need to add the condition in the router/index file in meta section as hideLayout: true -->
  <TheNavigation v-if="!route.meta.hideLayout" />
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" :key="route.fullPath" />
    </transition>
    <FooterComp v-if="!route.meta.hideLayout" />
  </router-view>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import FooterComp from '@/components/FooterComp.vue'
// import TheUtils from '@/components/TheUtils.vue'
const route = useRoute()
console.log(
  '%cWelcome to my %cfull-stack %capp',
  'color: #fb853b; font-weight: bold; font-family: "Fira Code"; font-size: 30px;',
  'color: #3c9d93; font-weight: bold; font-family: "Fira Code"; font-size: 32px;',
  'color: #fb853b; font-weight: bold; font-family: "Fira Code"; font-size: 30px;'
)
</script>

<style lang="scss">
@use '~'as *;
:root {
  height: 100vh;
  width: 100vw;
}

body {
  background-color: $primary1;
  color: $secondary1;
}

#app {
  margin: 30px;

  @media (max-width: 768px) {
    margin: 15px;
  }
}

.title {
  font-family: $main-font;
}

.container {
  background-color: $primary1;
  color: white;
}
/* Transition for router-view */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
