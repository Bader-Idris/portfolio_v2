<template>
  <!-- <TheUtils /> -->
  <TheNavigation />
  <router-view />
  <FooterComp />
</template>

<script setup lang="ts">
// import TheUtils from '@/components/TheUtils.vue'
import FooterComp from '@/components/FooterComp.vue'
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
</style>
