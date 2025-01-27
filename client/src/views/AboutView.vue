<template>
  <div class="about-me">
    <aside>
      <div class="tab">
        <img
          v-for="(icon, index) in icons"
          :key="icon.iconAlt"
          :src="icon.iconSrc"
          :alt="icon.iconAlt"
          :class="{ active: activeIconIndex === index }"
          @click="setActiveIcon(index)"
        />
      </div>
      <div class="lists">
        <FoldableTab @toggle="toggleHobbies">
          <p>personal_info</p>
        </FoldableTab>
        <div
          class="hobbies-bar"
          :class="{ hidden: isHobbiesHidden }"
          :style="{ display: hobbiesDisplay }"
        >
          <p
            v-for="(hobby, index) in hobbiesObj"
            :key="index"
            :class="{ active: activeHobbyIndex === index }"
            @click="setActiveHobby(index)"
          >
            <img :src="hobby.icon" :alt="hobby.iconAlt" />
            {{ hobby.title }}
          </p>
        </div>
        <FoldableTab :initially-folded="true" @toggle="toggleContact">
          <p>contacts</p>
        </FoldableTab>
        <div
          class="personal-contact"
          :class="{ hidden: isContactHidden }"
          :style="{ display: contactDisplay }"
        >
          <p @click="openMailTo(0)">
            {{ displayContactInfo[0] }}
            <i v-if="showIcon[0]" class="fa-solid fa-envelope"></i>
          </p>
          <p @click="copyToClipboard(1)">
            {{ contInfo[1] }}
            <i v-if="showIcon[1]" class="fa-solid fa-copy"></i>
          </p>
        </div>
      </div>
    </aside>
    <main>
      <router-view :key="$route.path" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Clipboard } from '@capacitor/clipboard'
import FoldableTab from '@/components/FoldableTab.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isMobile = ref(window.innerWidth < 768)
const activeIconIndex = ref(1) // Default active index
const isHobbiesHidden = ref<boolean>(false)
const isContactHidden = ref<boolean>(true)
const hasInitialized = ref(false)
const activeHobbyIndex = ref<number>(0) // defaulting to "bio"
const hobbiesDisplay = ref('block')
const contactDisplay = ref('none')

// Function to open mail client with email address
const openMailTo = (index: number): void => {
  const email = contInfo[index]
  if (email) {
    window.location.href = `mailto:${email}`
  } else {
    console.error('Email not found at the specified index')
  }
}

// @ts-ignore  Update your asset handling using import.meta.glob for dynamic imports
const svgIcons = import.meta.glob('../assets/imgs/svgs/*.svg', { eager: true, as: 'url' })
// TODO: using eager causes the assets to be loaded as one file, and fixing it is a long story ...

// Utility function to get image URL from the globbed assets
function getImageUrl(name: string): string {
  // Assuming the file path matches the structure in the glob pattern
  return svgIcons[`../assets/imgs/svgs/${name}`]
}
const setActiveHobby = (index: number) => {
  activeHobbyIndex.value = index
}

// Define the type for hobbies object array
interface Hobby {
  title: string
  icon: string
  iconAlt: string
}

const hobbiesObj = ref<Hobby[]>([
  { title: 'bio', icon: getImageUrl('red-dir.svg'), iconAlt: 'red folder' },
  {
    title: 'interests',
    icon: getImageUrl('green-dir.svg'),
    iconAlt: 'green folder'
  },
  {
    title: 'education',
    icon: getImageUrl('purple-dir.svg'),
    iconAlt: 'purple folder'
  },
  {
    title: 'high-school',
    icon: getImageUrl('md-icon.svg'),
    iconAlt: 'markdown icon'
  },
  {
    title: 'University',
    icon: getImageUrl('md-icon.svg'),
    iconAlt: 'markdown icon'
  }
])

// Define contact info array of strings
const contInfo: string[] = ['contact@baderidris.com', '+970595744368']
const showIcon = ref<boolean[]>([false, false])

const toggleHobbies = () => {
  if (isHobbiesHidden.value) {
    // If currently hidden, show it immediately
    isHobbiesHidden.value = false
    hobbiesDisplay.value = 'block' // Set display to block
  } else {
    // If currently visible, fade out and then hide
    isHobbiesHidden.value = true
    setTimeout(() => {
      hobbiesDisplay.value = 'none' // Set display to none after fade-out
    }, 500) // Match this timing with your CSS transition duration
  }
}
const toggleContact = () => {
  if (isContactHidden.value) {
    // If currently hidden, show it immediately
    isContactHidden.value = false
    contactDisplay.value = 'block' // Set display to block
  } else {
    // If currently visible, fade out and then hide
    isContactHidden.value = true
    setTimeout(() => {
      contactDisplay.value = 'none' // Set display to none after fade-out
    }, 300) // Match this timing with your CSS transition duration
  }
}

const copyToClipboard = async (index: number): Promise<void> => {
  try {
    await Clipboard.write({ string: contInfo[index] })
    showIcon.value = showIcon.value.map((value, i) => (i === index ? true : value))
    setTimeout(() => {
      showIcon.value = showIcon.value.map((value, i) => (i === index ? false : value))
    }, 2000)
  } catch (error) {
    console.error('Failed to copy to clipboard: ', error)
  }
}

const icons = ref([
  { iconSrc: getImageUrl('shell.svg'), iconAlt: 'shell', path: 'professional' },
  { iconSrc: getImageUrl('circle.svg'), iconAlt: 'circle', path: 'personal' },
  { iconSrc: getImageUrl('game.svg'), iconAlt: 'game', path: 'hobbies' }
])

const setActiveIcon = (index: number) => {
  activeIconIndex.value = index
  const selectedPath = icons.value[index].path
  router.push(`/about/${selectedPath}`)
}

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

// Computed property for conditional content
const displayContactInfo = computed(() => {
  return isMobile.value
    ? contInfo // Show full content on mobile
    : [contInfo[0].slice(0, -10) + ' ...', contInfo[1]] // Slice content on larger screens
})

// --- Mounted Lifecycle ---
onMounted(() => {
  window.addEventListener('resize', handleResize)
  if (!hasInitialized.value) {
    const currentRoute = router.currentRoute.value.path
    const matchedIconIndex = icons.value.findIndex((icon) => `/about/${icon.path}` === currentRoute)

    if (matchedIconIndex === -1) {
      // If no valid route is matched, set the default route
      setActiveIcon(1)
    } else {
      // Match the active icon index to the current route
      activeIconIndex.value = matchedIconIndex
    }

    hasInitialized.value = true // Ensure this logic runs only once
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
@use '~'as *;
.about-me {
  @include mainMiddleSettings;

  @media (max-width: 768px) {
    @include phone-borders;
  }
  @media screen and (max-width: 768px) {
    overflow-y: scroll;
    padding-bottom: 10vh;
  }
  aside {
    width: 300px;
    display: flex;
    @media screen and (max-width: 768px) {
      width: calc(100vw - 30px);
    }
    .tab {
      position: absolute;
      display: inline-flex;
      align-items: center;
      flex-direction: column;
      height: 100vh;
      width: 60px;
      border-right: 1px solid $lines;

      @media (max-width: 768px) {
        display: none;
      }

      img {
        margin: 10px;
        cursor: pointer;

        &:hover,
        &.active {
          filter: brightness(4);
          opacity: 0.9;
        }
      }
    }

    .lists {
      left: 60px;
      width: 240px;
      position: relative;
      display: inline-block;

      @media (max-width: 768px) {
        left: 0;
      }

      .hobbies-bar {
        margin-left: 30px;
        opacity: 1;
        visibility: visible;
        transition:
          opacity 0.5s ease,
          visibility 0.5s ease;
        &.hidden {
          opacity: 0;
          visibility: hidden;
          transition:
            opacity 0.5s ease,
            visibility 0.5s ease;
        }
        > p {
          &:hover {
            color: $secondary4;
            cursor: pointer;
          }
          &.active {
            color: $secondary4;
          }
        }
      }
    }
  }

  .personal-contact {
    position: relative;
    margin-left: 25px;
    opacity: 1;
    visibility: visible;
    transition:
      opacity 0.5s ease,
      visibility 0.5s ease;
    @media (max-width: 768px) {
      width: calc(100vw - 57px);
    }

    &.hidden {
      opacity: 0;
      visibility: hidden;
      transition:
        opacity 0.5s ease,
        visibility 0.5s ease;
    }

    p {
      margin: 10px;
      cursor: pointer;
      width: fit-content;

      @media screen and (max-width: 768px) {
        width: 100%;
      }

      &::before {
        margin-right: 10px;
        font-family: 'secret sauce';
        display: inline-block;
      }

      &:first-of-type::before {
        content: '\f0e0';
      }

      &:last-of-type::before {
        content: '\f095';
        transform: rotate(90deg);
      }

      &:hover {
        color: $secondary4;
        cursor: pointer;
      }
    }
  }
}
i {
  font-family: 'secret sauce';
  font-style: normal;
}
</style>
