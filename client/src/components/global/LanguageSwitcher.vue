<!--
<template>
  <div class="language-switcher">
    <input
      v-model="searchTerm"
      type="text"
      list="language-list"
      autocomplete="off"
      :placeholder="currentLanguageName"
      @input="updateLanguage"
    />
    <datalist id="language-list">
      <option
        v-for="(term, key) in searchTerms"
        :key="key"
        :value="term"
      />
    </datalist>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { loadLocaleMessages } from '@/i18n'

const { locale } = useI18n()
const router = useRouter()
const currentRoute = router.currentRoute.value
const pathKey = (currentRoute.meta.pathKey as string) || 'home'

const languages = [
  { code: 'US', name: 'English' },
  { code: 'PS', name: 'العربية' },
  { code: 'ES', name: 'Español' }
]

const selectedLang = ref(locale.value)

const getFlagEmoji = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

const searchTerms = computed(() => {
  const terms = []
  for (const lang of languages) {
    // Add variations for each language
    switch (lang.code) {
      case 'US':
        terms.push('English', 'US')
        break
      case 'PS':
        terms.push('عربي', 'العربية', 'Arabic', 'PS')
        break
      case 'ES':
        terms.push('Español', 'árabe', 'el árabe', 'ES')
        break
    }
  }
  return terms
})

const languageMapping: { [key: string]: string } = {}
for (const lang of languages) {
  const terms = searchTerms.value.filter(term =>
    lang.code === 'US' ? term === 'English' || term === 'US' :
    lang.code === 'PS' ? term === 'عربي' || term === 'العربية' || term === 'Arabic' || term === 'PS' :
    lang.code === 'ES' ? term === 'Español' || term === 'árabe' || term === 'el árabe' || term === 'ES' :
    ''
  )
  terms.forEach(term => {
    languageMapping[term] = lang.code
  })
}

const searchTerm = ref('')

watch(locale, (newLocale) => {
  selectedLang.value = newLocale
  searchTerm.value = getLanguageName(newLocale)
})

const getLanguageName = (code: string): string => {
  const lang = languages.find(l => l.code === code)
  return lang ? `${getFlagEmoji(lang.code)} ${lang.name}` : ''
}

const currentLanguageName = computed(() => getLanguageName(selectedLang.value))

const updateLanguage = async () => {
  const selectedTerm = searchTerm.value
  const langCode = languageMapping[selectedTerm] || selectedLang.value
  if (langCode !== selectedLang.value) {
    selectedLang.value = langCode
    locale.value = selectedLang.value
    await loadLocaleMessages(selectedLang.value, pathKey)
    console.log('Current lang:', document.documentElement.lang)
    searchTerm.value = getLanguageName(selectedLang.value)
  }
}
</script>
-->

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
