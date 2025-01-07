<template>
  <div class="register">
    <form class="form" @submit.prevent="register">
      <h1>Register</h1>
      <label for="user">user name</label>
      <input v-model="user" name="user" type="text" class="input" />
      <label for="email">email</label>
      <input v-model="email" name="email" type="email" class="input" />
      <label for="password">Password</label>
      <input v-model="password" name="password" type="text" class="input" />
      <!-- <button class="btn">Register</button> -->
      <button class="btn" :disabled="loading">
        <span v-if="loading">
          <CustomLoader />
        </span>
        <span v-else> Register </span>
      </button>
    </form>
    <div v-if="showPrompt" class="prompt">
      <AppLink aria-label="login page" to="/login" class="internal-link">login page</AppLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import CustomLoader from '@/components/CustomLoader.vue'
import { useUserStore } from '@/stores/UserNameStore'
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useRouter, useRoute } from 'vue-router'
import type { RequestOptions } from '@/types/fetch'
const user = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const loading = ref<boolean>(false)
const showPrompt = ref<boolean>(false)

// Vue Router
const router = useRouter()
const route = useRoute()

const DOMAIN_NAME = 'https://baderidris.com'

// Utility type for server response
interface RegisterResponse {
  msg: string
  [key: string]: any
}

const register = async function (): Promise<void> {
  // Input validation to avoid unnecessary API calls
  if (!user.value || !email.value || !password.value) {
    toast('All fields are required.', {
      theme: 'dark',
      type: 'error',
      position: 'top-center',
      dangerouslyHTMLString: true
    })
    return
  }

  loading.value = true

  const url = `${DOMAIN_NAME}/api/v1/auth/register`
  const data = {
    name: user.value,
    email: email.value,
    password: password.value
  }

  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  const requestOptions: RequestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(data),
    redirect: 'follow'
  }

  try {
    const response = await fetch(url, requestOptions)
    const result: RegisterResponse = await response.json()

    if (!response.ok) {
      // Handle different status codes explicitly
      switch (response.status) {
        case 400:
          toast(result.msg, {
            theme: 'dark',
            type: 'error',
            dangerouslyHTMLString: true
          })
          showPrompt.value = true
          break
        case 401:
          toast('Unauthorized. Please check your credentials.', {
            theme: 'dark',
            type: 'error',
            position: 'top-center'
          })
          break
        default:
          toast('An unexpected error occurred.', {
            theme: 'dark',
            type: 'error',
            position: 'top-center'
          })
      }
    } else {
      // @ts-ignore Successful response handling
      useUserStore().setUser(user.value)

      toast('Successfully Registered', {
        theme: 'auto',
        type: 'success',
        position: 'top-center',
        dangerouslyHTMLString: true
      })
      const redirectPath = (route.query.redirect as string) || '/protected'
      router.push(redirectPath)
    }
  } catch (error: any) {
    // Enhanced error handling for network issues
    console.error('Fetch error:', error)
    toast('Network error. Please try again.', {
      theme: 'dark',
      type: 'error',
      position: 'top-center'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss">
@use '~'as *;
.register {
  @include mainMiddleSettings;
  @media (max-width: 768px) {
      @include phone-borders;
    }
  .form {
    display: flex;
    flex-direction: column;
    max-width: 400px;
    margin: 0 auto;

    .input {
      border: 1px solid gray;
      padding: 10px;
      margin-bottom: 20px;
      border-radius: 5px;
    }

    .btn {
      background-color: #2c3e50;
      color: white;
      padding: 10px;
      border-radius: 5px;
      border: none;
      cursor: pointer;
    }
  }
}
</style>
