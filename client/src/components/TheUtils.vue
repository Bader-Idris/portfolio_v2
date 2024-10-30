<template>
  <div class="utils">
    <p v-if="isLoggedIn">Hello {{ username }}</p>
    <AppLink v-if="!isLoggedIn" to="/register">Register</AppLink>
    <AppLink v-if="!isLoggedIn" to="/login">Login</AppLink>
    <button v-if="isLoggedIn" @click="logout" class="logout">Logout</button>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/UserNameStore'
// import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// Define user object interface
interface User {
  userId: string
}

// Define user store interface if not already typed
interface UserStore {
  user: User | null
  isLoggedIn: boolean
  clearUser: () => void
}
// @ts-ignore
const userStore = useUserStore() as UserStore
// const router = useRouter() // Initialize router
// Computed property to check if user is logged in
const isLoggedIn = computed(() => userStore.isLoggedIn)

// @ts-ignore // Might be a stupid approach
const username = userStore.user?.username as User['username']

// Function to handle user logout
const logout = async (): Promise<void> => {
  const url = '/api/v1/auth/logout'
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  const requestOptions: {
    method: string
    headers: Headers
    body: string
    redirect: 'follow'
  } = {
    method: 'DELETE',
    headers: myHeaders,
    body: JSON.stringify({ userId: userStore.user?.userId }), // Type-safe user ID access
    redirect: 'follow'
  }

  try {
    const response = await fetch(url, requestOptions)
    const result = await response.text()
    if (response.ok) {
      userStore.clearUser()
      toast('Successfully logged out', {
        theme: 'auto',
        type: 'success',
        position: 'top-center',
        dangerouslyHTMLString: true
      })
      // router.push('/login'); // Uncomment to navigate to login
    } else {
      console.error('Logout failed:', result)
    }
  } catch (error) {
    console.error('Error during logout:', error)
  }
}

// Initialize user from localStorage
const storedUser = localStorage.getItem('user')
if (storedUser) {
  try {
    userStore.user = JSON.parse(storedUser) as User // Type-safe JSON parse
  } catch (error) {
    console.error('Failed to parse stored user:', error)
  }
} else {
  userStore.user = null
}
</script>

<style lang="scss" scoped>
@use '~'as *;
.utils {
  width: 100%;
  height: 40px;
  background: #011627;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  align-content: center;
  align-items: center;
  justify-content: flex-end;
  * {
    font-size: 16px;
    color: white;
    width: fit-content;
    padding: 10px;
  }
  a {
  }
  .logout {
    width: fit-content;
    background: #61488e3b;
    color: #007bff;
    font-weight: bold;
    margin: 0 10px 0 15px;
    cursor: pointer;
    border: none;
    border-radius: 10px;
    padding: 5px;
    transition: opacity 0.3s ease;
    &:hover {
      opacity: 0.3;
      background-color: white;
      color: #000dff;
      transition: 0.3;
    }
  }
}
</style>
