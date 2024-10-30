<template>
  <div class="projects">
    <NavbarProjects @toggle-sidebar="toggleSidebar" />
    <aside>
      <ProjectsSidebar
        :is-sidebar-hidden="isSidebarHidden"
        :list="list"
        @toggle-active="toggleActive"
      />
      <SelectedTabs :active-items="activeItems" @remove-item="removeItem" />
    </aside>
    <FilteredProjects :active-items="activeItems" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import NavbarProjects from '@/components/NavbarProjects.vue'
import ProjectsSidebar from '@/components/ProjectsSidebar.vue'
import SelectedTabs from '@/components/SelectedTabs.vue'
import FilteredProjects from '@/components/FilteredProjects.vue'

// const list = ref([
const list = ref<Array<{ title: string; imgAlt: string; isActive: boolean }>>([
  { title: 'HTML', imgAlt: 'html icon', isActive: true },
  { title: 'CSS', imgAlt: 'css icon', isActive: false },
  { title: 'Vue', imgAlt: 'vue icon', isActive: false },
  // { title: "Docker", imgAlt: "docker icon", isActive: false },
  { title: 'Typescript', imgAlt: 'Typescript icon', isActive: false }
  // { title: "Express", imgAlt: "Express icon", isActive: false },
  // { title: "Shell", imgAlt: "shell icon", isActive: false },
])

const toggleActive = (item) => {
  item.isActive = !item.isActive
  saveActiveItems()
}

const activeItems = computed(() => {
  return list.value.filter((item) => item.isActive).map((item) => item.title)
})

const saveActiveItems = () => {
  const activeItems = list.value.filter((item) => item.isActive).map((item) => item.title)
  localStorage.setItem('activeItems', JSON.stringify(activeItems))
}

const loadActiveItems = () => {
  try {
    // @ts-ignore
    const storedActiveItems = JSON.parse(localStorage.getItem('activeItems'))
    if (storedActiveItems) {
      list.value.forEach((item) => {
        item.isActive = storedActiveItems.includes(item.title)
      })
    }
  } catch (error) {
    console.error('Error loading active items:', error)
  }
}

const removeItem = (itemTitle) => {
  const item = list.value.find((item) => item.title === itemTitle)
  if (item) {
    item.isActive = false
    saveActiveItems()
  }
}

const isSidebarHidden = ref(false)
const toggleSidebar = () => {
  isSidebarHidden.value = !isSidebarHidden.value
}

onMounted(() => {
  loadActiveItems()
})

watch(list, saveActiveItems, { deep: true })
</script>

<style lang="scss" scoped>
@use '~'as *;
.projects {
  overflow-y: scroll !important;
  @include mainMiddleSettings;
  @media (max-width: 768px) {
    @include phone-borders;
  }
}
</style>
