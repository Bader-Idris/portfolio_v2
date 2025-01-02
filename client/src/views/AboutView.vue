<template>
  <div class="about-me">
    <aside>
      <div class="tab">
        <!-- <img v-for="icon in icons" :key="icon.iconAlt" :src="icon.iconSrc" :alt="icon.iconAlt" /> -->
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
        <div class="hobbies-bar" :class="{ hidden: isHobbiesHidden }">
          <p v-for="(hobby, index) in hobbiesObj" :key="index">
            <img :src="hobby.icon" :alt="hobby.iconAlt" />
            {{ hobby.title }}
          </p>
        </div>
        <FoldableTab @toggle="toggleContact">
          <p>contacts</p>
        </FoldableTab>
        <div class="personal-contact" :class="{ hidden: isContactHidden }">
          <p @click="copyToClipboard(0)">
            {{ contInfo[0].slice(0, -10) + ' ...' }}
            <i v-if="showIcon[0]" class="fa-solid fa-copy"></i>
          </p>
          <p @click="copyToClipboard(1)">
            {{ contInfo[1] }}
            <i v-if="showIcon[1]" class="fa-solid fa-copy"></i>
          </p>
        </div>
      </div>
    </aside>
    <main class="split-in-half">
      <div ref="bioContainer" class="personal-bio">
        <!-- Render each parsed line as a <p> element with bold formatting applied where necessary -->
        <p v-for="(line, index) in formattedBio" :key="index">
          <span v-for="(segment, i) in line" :key="i" :class="segment.isBold ? 'bold-text' : ''">
            {{ segment.text }}
          </span>
        </p>
      </div>

      <div class="code-snippet">
        <div class="code-author">
          <img class="mi-imagen" src="@/assets/imgs/me_2024-03-13.jpg" alt="personal-img" />
          <div class="auth-aside">
            <p>@bader-idris</p>
            <p>{{ createTimeCodeSnippet }}</p>
          </div>
        </div>
        <pre>
          <code ref="codeBlock" class="javascript">
  const pigIt = (str) => {
    return str.split(' ').map(e => {
      return e.length > 0 && !e.match(/[!?@#$%^&*]/)
        ? e.substring(1) + e.slice(0, 1) + 'ay'
        : e;
    }).join(' ');
  };
          </code>
        </pre>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Clipboard } from '@capacitor/clipboard'
import FoldableTab from '@/components/FoldableTab.vue'
import hljs from 'highlight.js' // Import highlight.js
import 'highlight.js/styles/github-dark.css' // You can change the theme here

const codeBlock = ref<HTMLElement | null>(null)
const isHobbiesHidden = ref<boolean>(false)
const isContactHidden = ref<boolean>(false)
const bioContainer = ref<HTMLElement | null>(null)
const activeIconIndex = ref(1) // Default active index

// Calculate the duration since June 15, 2022
const startDate = new Date('2022-06-15')
const currentDate = new Date()
const diffInMs = currentDate.getTime() - startDate.getTime()
const diffInYears = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365.25))
const diffInMonths = Math.floor(
  (diffInMs % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44)
)

interface Segment {
  text: string
  isBold: boolean
}

// The bio string with newlines for formatting
const bio = ref<string>(`
I started my programming journey on June 15, 2022, which means I've been honing my skills for ${diffInYears} years and ${diffInMonths} months.

Since then, I've gained solid expertise in:
✅ **Web Development**: Mastered HTML5, CSS3, and JavaScript to build dynamic, responsive websites. I then expanded into **Vue.js (Composition API and Vue Router 4)**, to create sophisticated front-end applications.

✅ **Backend Development**: I built five back-end projects using **Node.js, Express.js, and MongoDB** as part of the FreeCodeCamp curriculum. This journey helped me gain a strong foundation in creating RESTful APIs and deploying full-stack applications.

✅ **Database Management**: After learning **MongoDB**, I furthered my knowledge with **PostgreSQL (PSQL)**, focusing on scalable and secure data solutions.

✅ **DevOps & Deployment**: I became proficient with **Docker**, deploying containerized applications, and configuring servers with **Nginx**. I've also gained skills in **DevOps** workflows to automate, optimize, and manage deployments efficiently.

✅ **Cross-Platform Development**: I leveraged **Capacitor.js** and **Electron** to build applications that work seamlessly across web, mobile (iOS/Android), and desktop (Windows/Mac/Linux).

As a versatile full-stack developer, I combine my technical knowledge with creativity to deliver scalable, secure, and efficient solutions for modern digital challenges. Let's collaborate to bring your ideas to life!
`)

// Function to process the bio and convert it into a structured format
function parseBioText(text: string): Segment[][] {
  return text.split('\n').map((line) => {
    const segments: Segment[] = []
    let match
    const boldRegex = /\*\*(.*?)\*\*/g

    let lastIndex = 0
    while ((match = boldRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ text: line.slice(lastIndex, match.index), isBold: false })
      }
      segments.push({ text: match[1], isBold: true })
      lastIndex = match.index + match[0].length
    }

    if (lastIndex < line.length) {
      segments.push({ text: line.slice(lastIndex), isBold: false })
    }

    return segments
  })
}

// Computed property to store the formatted bio
const formattedBio = computed(() => parseBioText(bio.value))

// Define the type for hobbies object array
interface Hobby {
  title: string
  icon: string
  iconAlt: string
}

// @ts-ignore  Update your asset handling using import.meta.glob for dynamic imports
const svgIcons = import.meta.glob('../assets/imgs/svgs/*.svg', { eager: true, as: 'url' })
// TODO: using eager causes the assets to be loaded as one file, and fixing it is a long story ...

// Utility function to get image URL from the globbed assets
function getImageUrl(name: string): string {
  // Assuming the file path matches the structure in the glob pattern
  return svgIcons[`../assets/imgs/svgs/${name}`]
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

const toggleHobbies = (): void => {
  isHobbiesHidden.value = !isHobbiesHidden.value
}
const toggleContact = (): void => {
  isContactHidden.value = !isContactHidden.value
}

const copyToClipboard = async (index: number): Promise<void> => {
  try {
    await Clipboard.write({ string: contInfo[index] })

    // Show icon for 1 second
    showIcon.value = showIcon.value.map((value, i) => (i === index ? true : value))
    setTimeout(() => {
      showIcon.value = showIcon.value.map((value, i) => (i === index ? false : value))
    }, 1000)
  } catch (error) {
    console.error('Failed to copy to clipboard: ', error)
  }
}

const icons = ref([
  { iconSrc: getImageUrl('shell.svg'), iconAlt: 'shell' },
  { iconSrc: getImageUrl('circle.svg'), iconAlt: 'circle' },
  { iconSrc: getImageUrl('game.svg'), iconAlt: 'game' }
])

const setActiveIcon = (index: number): void => {
  activeIconIndex.value = index
}

// --- Drag Handling Functions ---
let isDragging = false
let startY = 0
let scrollTop = 0

function handleMouseDown(event: MouseEvent | TouchEvent): void {
  if (window.innerWidth < 768) return // PC only check
  isDragging = true
  bioContainer.value?.classList.add('grabbing')
  startY = 'touches' in event ? event.touches[0].pageY : event.pageY
  scrollTop = bioContainer.value?.scrollTop || 0
}

function handleMouseMove(event: MouseEvent | TouchEvent): void {
  if (window.innerWidth < 768 || !isDragging || !bioContainer.value) return // PC only check
  const y = 'touches' in event ? event.touches[0].pageY : event.pageY
  bioContainer.value.scrollTop = scrollTop - (y - startY)
}

function handleMouseUp(): void {
  if (window.innerWidth < 768) return // PC only check
  isDragging = false
  bioContainer.value?.classList.remove('grabbing')
}

const createTimeCodeSnippet = computed(() => {
  const now = new Date()
  const then = new Date('2023-05-19T00:00:00.000Z')
  const diff = now.getTime() - then.getTime()
  const monthDiff = Math.floor(diff / (1000 * 60 * 60 * 24 * 30))
  return `created ${monthDiff} months ago`
})

// --- Mounted Lifecycle ---
onMounted(() => {
  if (codeBlock.value) hljs.highlightElement(codeBlock.value)
  if (bioContainer.value) {
    bioContainer.value.addEventListener('mousedown', handleMouseDown)
    bioContainer.value.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }
})

onUnmounted(() => {
  if (bioContainer.value) {
    bioContainer.value.removeEventListener('mousedown', handleMouseDown)
    bioContainer.value.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  setActiveIcon(1) // Set the active index to 1 on mount
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

        &.hidden {
          display: none;
        }
      }
    }
  }

  .personal-contact {
    position: relative;
    margin-left: 25px;

    &.hidden {
      display: none;
    }

    p {
      margin: 10px;
      cursor: pointer;
      width: fit-content;

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

  .split-in-half {
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(100% - 300px);

    @media screen and (max-width: 768px) {
      width: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
    }
    @media screen and (min-width: 769px) {
      left: 300px;
      position: absolute;
      top: 0;
      height: calc(100vh - 180px);
    }
    > * {
      width: calc(50% - 20px);
      padding: 0 20px;

      @media screen and (max-width: 768px) {
        width: 100%;
        padding: 0 20px;
      }
    }

    .personal-bio {
      height: 50vh;
      overflow-y: scroll;
      cursor: grab;
      user-select: none;
      @media screen and (max-width: 768px) {
        & {
          overflow-y: auto;
        }
      }
      &.grabbing {
        cursor: grabbing;
      }

      @media screen and (max-width: 768px) {
        height: inherit;
        & p {
          // height: 80vh;
          margin-bottom: 30px;
          // background-color: yellow;
        }
      }
    }

    .code-snippet {
      border-radius: 40px;
      overflow-y: auto;
      max-height: 400px;
      padding: 20px;

      .code-author {
        display: flex;
        align-items: center;
        .mi-imagen {
          width: 40px;
          height: 40px;
          border-radius: 12em;
          border: 2px solid $lines;
          margin-right: 15px;
        }

        & p:first-of-type {
          color: $gradients1;
          font-weight: bold;
        }
        & p:nth-of-type(2) {
          font-size: $labels-size * 0.8;
        }
        & p {
          margin: 10px 0;
        }
      }
      & *:not(.code-author, .code-author *) {
        background-color: $code-snippets-bg;
      }
      pre {
        border-right: 1px solid $lines;
        margin: 0;
        border-radius: 40px;
        white-space: pre-wrap;
        word-wrap: break-word;
      }

      code {
        font-size: 14px;
        line-height: 1.5;
      }
    }
  }
}
i {
  font-family: 'secret sauce';
  font-style: normal;
}
</style>
