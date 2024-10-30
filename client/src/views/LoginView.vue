<template>
  <div class="login">
    <form class="form" @submit.prevent="login">
      <h1>Login</h1>
      <div class="input-container">
        <label for="email">Email</label>
        <input v-model="email" name="email" type="text" class="input" aria-labelledby="email" />
      </div>
      <div class="input-container">
        <label for="password">Password</label>
        <input
          v-model="password"
          name="password"
          type="password"
          class="input"
          aria-labelledby="password"
        />
      </div>
      <button class="btn" :disabled="loading">
        <span v-if="loading">
          <CustomLoader />
        </span>
        <span v-else> Login </span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
// converted from Options API to Composition API
import CustomLoader from '@/components/CustomLoader.vue'
import { useUserStore } from '@/stores/UserNameStore'
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useRouter, useRoute } from 'vue-router'

// State for email, password, and loading
const email = ref<string>('')
const password = ref<string>('')
const loading = ref<boolean>(false)

// Vue Router
const router = useRouter()
const route = useRoute()

// UserStore instance
const userStore = useUserStore()

// Function to handle login with type safety
const login = async (): Promise<void> => {
  loading.value = true

  const url = '/api/v1/auth/login'
  const data = {
    email: email.value,
    password: password.value
  }

  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  const requestOptions: {
    method: string
    headers: Headers
    body: string
    redirect: 'follow'
  } = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(data),
    redirect: 'follow'
  }

  try {
    const response = await fetch(url, requestOptions)

    if (!response.ok) {
      const redirectPath = (route.query.redirect as string) || '/failed'
      router.push(redirectPath)
      throw new Error('Login failed')
    }

    const result = await response.json()

    // Check and validate the response for required fields
    if (!result.user || !result.user.name || !result.user.userId || !result.user.role) {
      throw new Error('Invalid response format')
    }

    // Set user in store
    const user = {
      username: result.user.name,
      userId: result.user.userId,
      role: result.user.role
    }
    userStore.setUser(user)

    // Display success toast message
    toast('Successfully logged in', {
      theme: 'auto',
      type: 'success',
      position: 'top-center',
      dangerouslyHTMLString: true
    })

    // Redirect after successful login
    const redirectPath = (route.query.redirect as string) || '/protected'
    router.push(redirectPath)
  } catch (error) {
    console.error('Login error: ', error)
    toast('Login failed, please try again', {
      theme: 'dark',
      type: 'error',
      position: 'top-center',
      dangerouslyHTMLString: true
    })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss">
@use '~'as *;
.login {
  // @include inTheMiddle;
  .form {
    width: 384px;
    height: 520px;
    position: relative;
    display: flex;
    margin: auto;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    // @include softForm;
    h1 {
      text-align: center;
      margin-bottom: 50px;
    }
    .input-container {
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;

      label {
        margin-bottom: 5px;
      }
      .input {
        border: 1px solid gray;
        padding: 10px;
        border-radius: 5px;
      }
    }
    .btn {
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 500;
      font-size: 20px;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-top: 50px;
      span {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      }
    }
  }
}
</style>
