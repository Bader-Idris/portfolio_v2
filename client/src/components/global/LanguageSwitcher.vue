<!-- <template>
  <div class="language-switcher">
    <input
      list="languageList"
      placeholder="Search languages... (e.g., español, اسبانية, Spanish)"
      v-model="searchTerm"
      @input="filterLanguages"
      @change="switchLanguage"
    />
    <datalist id="languageList">
      <option v-for="lang in filteredLanguages" :key="lang.code" :value="lang.display" />
    </datalist>
  </div>
</template> -->

<!-- <script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// Initialize i18n
const { locale } = useI18n()

// Search term for filtering languages
const searchTerm = ref('')

// Available languages with multiple keywords for search
const languages = [
  {
    code: 'en',
    display: 'English 🇬🇧',
    keywords: ['English', 'انجليزي', 'Anglais']
  },
  {
    code: 'ar',
    display: 'العربية 🇸🇦',
    keywords: ['العربية', 'Arabic', 'Arabisch', 'árabe']
  },
  {
    code: 'es',
    display: 'Español 🇪🇸',
    keywords: ['Español', 'Spanish', 'اسبانية', 'اسبانيا']
  }
]

// Filtered languages based on search term
const filteredLanguages = computed(() => {
  return languages.filter((lang) =>
    lang.keywords.some((keyword) => keyword.toLowerCase().includes(searchTerm.value.toLowerCase()))
  )
})

// Method to switch language based on input value
const switchLanguage = () => {
  const selectedLang = languages.find((lang) => lang.display === searchTerm.value)
  if (selectedLang) {
    locale.value = selectedLang.code
    document.documentElement.lang = selectedLang.code // Update for SEO
  }
}
</script> -->

<template>
  <div class="language-switcher">
    <select v-model="selectedLang" @change="switchLanguage">
      <option v-for="lang in languages" :key="lang.code" :value="lang.code">
        {{ getFlagEmoji(lang.code) }} {{ lang.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { loadLocaleMessages } from '@/i18n'

const { locale } = useI18n()
const router = useRouter()
const currentRoute = router.currentRoute.value
const pathKey = (currentRoute.meta.pathKey as string) || 'home'

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
  { code: 'es', name: 'Español' }
]

const selectedLang = ref(locale.value)

const getFlagEmoji = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

const switchLanguage = async () => {
  locale.value = selectedLang.value
  await loadLocaleMessages(selectedLang.value, pathKey)
  console.log('Current lang:', document.documentElement.lang)
}
</script>

<style lang="scss" scoped>
.language-switcher {
  z-index: 999;
  @media screen and (max-width: 768px) {
    right: 60px;
    position: absolute;
  }
  @media screen and (min-width: 769px) {
    right: 180px;
    position: absolute;
  }
  > select {
    width: 100px;
    background-color: #333;
    color: #fff;
    width: 30px;
    font-weight: bold;
    border: none;
    border-radius: 4px;
    padding: 8px;
    font-size: 14px;
    appearance: none;
    background-image: linear-gradient(to right, #ff7e5f, #fea55f);
    cursor: pointer;
    option {
      background-color: #333;
      color: #fff;
    }
  }
  input {
    width: 200px;
    padding: 8px;
    font-size: 14px;
  }
}
</style>
