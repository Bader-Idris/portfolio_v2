<template>
  <div>
    <div v-if="filteredProjects.length === 0" class="empty-message">
      <p>
        Please select a programming tool to view my projects. Your choice is crucial to proceed.
      </p>
    </div>
    <div v-else class="filtered-projects">
      <div v-for="project in filteredProjects" :key="project.title" class="project-card">
        <h3 class="card-title">// {{ project.title }}</h3>
        <!--? fix this to be exactly as the design does, putting the image before its description -->
        <a :href="project.url" target="_blank">
          <img :src="project.img" :alt="project.title" />
        </a>
        <p>{{ project.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import projects from '@/projects_info.json'

const props = defineProps({
  activeItems: {
    type: Array,
    required: true
  }
})

const filteredProjects = computed(() => {
  // @ts-ignore
  const activeItemsLower = props.activeItems.map((item) => item.toLowerCase() as string) // does this ts as string work??
  return projects.filter((project) =>
    project.tags.some((tag) => activeItemsLower.includes(tag.toLowerCase()))
  )
})
</script>

<style lang="scss">
@use '~'as *;
.empty-message {
  color: $accent1;
  border-radius: 25px;
  background: #181818;

  @media screen and (max-width: 768px) {
    box-shadow: 0 0 20px 7px #ffffff12;
    width: calc(100% - 20px);
    margin: auto;
    text-align: center;
    line-height: 1.5;
    font-size: 26px;
    padding: 10px;
  }

  p {
    @media screen and (min-width: 769px) {
      // left: 300px;
      position: absolute;
      width: calc(100% - 300px);
      max-width: 1000px;
      font-size: 36px;
      margin: 0 50px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

.filtered-projects {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  left: 350px;
  position: absolute;
  top: 100px;
  overflow: hidden;
  padding-bottom: 100px;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    left: 0;
    top: 0;
    // padding: 0 20px;
    position: relative;
  }

  .project-card {
    padding: 20px;
    border-radius: 8px;
    width: calc(33% - 40px);
    width: 100%;

    .card-title {
      font-size: $body-text-size;
    }

    p {
      padding-top: 20px;
      text-align: center;
    }

    img {
      // put a better broken images message
      max-width: 100%;
      height: auto;
      display: block;
      margin-bottom: 10px;
      border-radius: 10px;

      min-width: 200px;
      min-height: 200px;
      background: $primary3;
      position: relative;

      &::before {
        content: 'broken image';
        background-color: #621767;
        width: 100%;
        height: 100%;
        position: absolute;
        font-size: 35px;
        color: $secondary4;
        font-weight: bold;
        text-transform: uppercase;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        line-height: 6;
      }
    }
  }

  @media (min-width: 768px) {
    display: flex;
    align-content: center;
    justify-content: space-evenly;
    width: calc(100vw - 430px);
    flex-direction: row;
    flex-wrap: wrap;
    align-items: stretch;
  }

  @media (min-width: 1200px) {
    .project-card {
      flex-basis: calc(50% - 10px);
    }
  }

  @media (min-width: 1400px) {
    .project-card {
      flex-basis: calc(33% - 10px);
    }
  }
}
</style>
