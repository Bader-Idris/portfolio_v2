<template>
  <header>
    <div class="container">
      <div class="name">{{ name }}</div>
      <nav class="nav">
        <AppLink to="/" class="sub-navs" :class="{ active: $route.path === '/' }">_hello</AppLink>
        <AppLink
          to="/about"
          class="sub-navs"
          :class="{ active: /^\/about(\/.*)?$/.test($route.path) }"
          >_about-me
        </AppLink>
        <AppLink to="/projects" class="sub-navs" :class="{ active: $route.path === '/projects' }"
          >_projects</AppLink
        >
      </nav>
      <LanguageSwitcher />
      <AppLink
        to="/contact"
        class="contact sub-navs"
        :class="{ active: $route.path === '/contact' }"
        >_contact-me</AppLink
      >
    </div>
    <div v-if="showBurgerNav" class="burger-nav" @click="togglePhoneMenu">
      <span v-for="i in 3" :key="i"></span>
    </div>
    <div v-show="showPhoneMenu" class="phone-menu">
      <div class="remove-phone-menu" @click="togglePhoneMenu">
        <span v-for="i in 2" :key="i"></span>
      </div>
      <div class="phone-body">
        <div class="name">{{ name }}</div>
        <ul>
          <AppLink
            to="/"
            class="phone-sub-navs"
            :class="{ active: $route.path === '/' }"
            @click="togglePhoneMenu"
          >
            _hello</AppLink
          >
          <AppLink
            to="/about"
            class="phone-sub-navs"
            :class="{ active: /^\/about(\/.*)?$/.test($route.path) }"
            @click="togglePhoneMenu"
            >_about-me</AppLink
          >
          <AppLink
            to="/projects"
            class="phone-sub-navs"
            :class="{ active: $route.path === '/projects' }"
            @click="togglePhoneMenu"
            >_projects</AppLink
          >
          <AppLink
            to="/contact"
            class="contact-phone phone-sub-navs"
            :class="{ active: $route.path === '/contact' }"
            @click="togglePhoneMenu"
            >_contact-me
          </AppLink>
        </ul>
      </div>
      <FooterComp style="display: block; bottom: 0" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { debounce } from 'lodash-es'
import FooterComp from '@/components/FooterComp.vue'
// import { App as CapacitorApp } from '@capacitor/app' // stopped because we removed it
// import { useRouter, useRoute } from 'vue-router'
import { useRoute } from 'vue-router'
import LanguageSwitcher from '@/components/global/LanguageSwitcher.vue'

const showBurgerNav = ref(window.outerWidth <= 768)
const showPhoneMenu = ref(false)
const name = ref('Bader-Idris')
const currentPath = ref('')

const handleResize = debounce(() => {
  showBurgerNav.value = window.outerWidth <= 768
}, 300) // Debounce with 300ms delay

// const router = useRouter()
const route = useRoute()

// Update current path whenever the phone menu is toggled
const togglePhoneMenu = () => {
  const menu = document.querySelector('.phone-menu') // Select the menu
  if (showPhoneMenu.value) {
    // If menu is currently open, close it
    menu?.classList.remove('open')
    showPhoneMenu.value = false
  } else {
    // If menu is closed, store the current path and open it
    menu?.classList.add('open')
    currentPath.value = route.fullPath
    showPhoneMenu.value = true
  }
}

onMounted(() => {
  // Set up resize event listener
  window.addEventListener('resize', handleResize)

  // Intercept back button on Android devices
  // CapacitorApp.addListener('backButton', (event) => {
  //   // Check if the phone menu is open
  //   if (showPhoneMenu.value) {
  //     event.canGoBack = false // Prevent default back navigation
  //     togglePhoneMenu() // Close the menu
  //     router.push(currentPath.value) // Navigate to the stored path (if needed)
  //   } else {
  //     // Allow default behavior if the menu is not open
  //     event.canGoBack = true // This allows normal back navigation
  //   }
  // })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss">
@use '~'as *;

.sub-navs {
  //! TODO: Add hover effect
  padding: 21px 30px;
  cursor: pointer;
  color: $secondary1;
  text-decoration: none;
  position: relative;

  &.active::before {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: -3px;
    left: 0;
    border-bottom: 3px solid $accent1;
  }

  &:hover {
    background-color: $primary1-hovered;
  }

  &.active {
    color: $secondary4;
  }

  &::after {
    content: '';
    border-color: $lines;
    border-width: 1px;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  &:not(.contact)::after {
    border-style: hidden solid hidden solid;
  }

  &.contact::after {
    border-style: hidden hidden hidden solid;
  }
}

header {
  position: relative;
  height: 60px;
  font-family: $main-font;
  background-color: $primary2;
  color: $secondary1;
  width: 100%;
  border: 1px solid $lines;
  border-width: 1px 1px 0 1px;
  border-radius: 5px 5px 0 0;
  > .container {
    color: inherit;
    background-color: inherit;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    flex-wrap: wrap;
    padding: 0 20px;
    & > .name {
      position: relative;
      padding: 15px 0;
      line-height: 1.7;
      @media (max-width: 768px) {
        &::after {
          content: '';
          position: absolute;
          width: calc(100vw - 32px);
          height: 100%;
          left: -20px;
          top: 2px;
          border-bottom: 1px solid $lines;

          box-shadow: 0 2px 20px 0 #0000008a;
          z-index: 1;
        }
      }
      @media (min-width: 769px) {
        flex-basis: 280px;
      }
    }
    .nav {
      display: flex;
      flex-basis: 420px;

      // & >
    }
    .contact {
      // align-self: flex-end;
      cursor: pointer;
      z-index: 1;
      position: absolute;
      right: 0;
    }

    @media (max-width: 768px) {
      .nav,
      .contact {
        display: none;
      }
    }
  }
  @media (max-width: 768px) {
    .burger-nav {
      z-index: 2;
      width: 40px;
      height: 40px;
      position: absolute;
      top: 12px;
      right: 10px;
      padding: 10px;
      span {
        position: relative;
        display: block;
        width: 100%;
        height: 2px;
        background-color: $secondary1;
        border-radius: 1px;
        margin-bottom: 4px;
      }
    }
    .phone-menu {
      font-family: $main-font;
      width: 100%;
      height: calc(100vh - 30px);
      background-color: $primary2;
      z-index: 999;
      position: relative;
      top: -58px;
      border-radius: 5px;
      transition:
        transform 0.3s ease-in-out,
        opacity 0.3s ease-in-out;
      /* Add transitions */
      transform: translateY(-100%);
      /* Default hidden state */
      opacity: 0;
      /* Default hidden state */

      &.open {
        transform: translateY(0);
        /* Fully visible */
        opacity: 1;
        /* Fully visible */
      }

      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100vh;
        background-color: $primary1;
        left: -15px;
        top: -15px;
        z-index: -1;
      }

      .remove-phone-menu {
        z-index: 2;
        top: 15px;
        right: 15px;
        position: absolute;
        width: 40px;
        height: 40px;
        padding: 10px;

        span {
          display: block;
          width: 100%;
          height: 2px;
          background-color: $secondary1;
          border-radius: 1px;
          margin-bottom: 4px;

          &:first-of-type {
            transform: rotate(45deg) translateX(20%);
          }

          &:last-of-type {
            transform: rotate(-45deg) translateX(20%);
          }
        }
      }

      @media (max-width: 768px) {
        .phone-body {
          border-radius: 5px 5px 0 0;
          height: calc(100vh - 88px);
          align-content: flex-start;
          @include mainMiddleSettings;

          .name {
            padding: 20px;
            border-bottom: 1px solid $lines;
          }

          .phone-sub-navs {
            padding: 15px 20px;
            cursor: pointer;
            color: $secondary1;
            text-decoration: none;
            display: block;
            text-align: center;

            &.active {
              color: $secondary4;
            }

            @media (min-width: 768px) {
              &:hover {
                background-color: $primary1-hovered;
              }
            }

            .contact {
              left: 0;
              position: relative;
            }
          }

          > ul {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            position: relative;

            & > a {
              &::before {
                content: '';
                position: absolute;
                border-bottom: 1px solid $lines;
                width: calc(100vw - 33px);
                left: 0;
                height: 0px;
                padding: 17px 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>
