<template>
  <span id="line"></span>
  <div class="nav-titled">
    <div class="foldable-tab" :class="{ 'is-folded': isToggled }" @click="toggleFolding">
      <span class="fas fa-triangle"> </span>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const emit = defineEmits(['toggle'])

const isToggled = ref(false)
const toggleFolding = () => {
  isToggled.value = !isToggled.value
  emit('toggle')
}
</script>

<style lang="scss" scoped>
@use '~'as *;
.nav-titled {
  width: 301px;
  // border-right: 1px solid $lines;
  color: $secondary4;
  position: relative;

  #line {
    position: relative;
    user-select: none;
    font-family: $main-font;
    font-weight: bold;
    /* font-size: 20px; */
    letter-spacing: 0.7px;
  }

  @media (min-width: 769px) {
    // &::after {
    //   content: "";
    //   position: absolute;
    //   width: 1px;
    //   right: 0;
    //   top: 0;
    //   height: calc(100vh - 180px);
    //   border-right: 1px solid $lines;
    // }
  }
}

@media (min-width: 769px) {
  #line {
    width: 1px;
    top: 30px;
    left: 331px;
    position: fixed;
    display: inline-block;
    background: $lines;
    height: calc(100vh - 80px);
  }
}

.foldable-tab {
  display: flex;
  align-items: baseline;
  padding-left: 10px;
  user-select: none;

  @media (max-width: 768px) {
    background-color: $lines;
    height: 30px;
    align-items: center;
    width: 100vw;
  }

  > span {
    transform: rotate(180deg);
    transition: transform 0.3s ease-in-out;
    font-size: 10px;
    padding: 15px 10px;
  }
}

.foldable-tab.is-folded > span {
  transform: rotate(90deg);
}
</style>
