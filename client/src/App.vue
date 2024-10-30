<template>
  <!-- <TheUtils /> -->
  <TheNavigation />
  <router-view />
  <FooterComp />
</template>

<script setup lang="ts">
// import TheUtils from '@/components/TheUtils.vue'
import FooterComp from '@/components/FooterComp.vue'
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
