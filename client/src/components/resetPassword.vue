<template>
  <div class="reset-password-form">
    <form @submit.prevent="resetPassword">
      <h2>Reset Your Password</h2>
      <input v-model="newPassword" type="password"
        placeholder="Enter new password" required />
      <input v-model="confirmPassword" type="password"
        placeholder="Confirm new password" required />
      <CustomButtons button-type="primary" aria-label="Reset Password">
        <span>Reset Password</span>
      </CustomButtons>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import type { RequestOptions } from '@/types/fetch'

// Access route parameters
const route = useRoute()
const router = useRouter()
const email = ref<string | null>((route.query.email as string) || null)
const token = ref<string | null>((route.query.token as string) || null)

// Reactive properties for password input
const newPassword = ref<string>('')
const confirmPassword = ref<string>('')

const DOMAIN_NAME = 'https://baderidris.com'

// Ensure email and token exist
if (!email.value || !token.value) {
  console.error('Email or token query parameters are missing')
}

// Function to reset the password
async function resetPassword(): Promise<void> {
  // Check if passwords match
  if (newPassword.value !== confirmPassword.value) {
    toast('Passwords do not match', {
      theme: 'dark',
      type: 'error',
      dangerouslyHTMLString: true
    })
    return
  }

  // Check if a new password is provided
  if (!newPassword.value) {
    toast('Please enter a new password', {
      theme: 'dark',
      type: 'error',
      dangerouslyHTMLString: true
    })
    return
  }

  // Ensure email and token are valid
  if (!email.value || !token.value) {
    toast('Invalid email or token', {
      theme: 'dark',
      type: 'error',
      dangerouslyHTMLString: true
    })
    return
  }

  // Prepare request headers
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  // Prepare request body
  const raw = JSON.stringify({
    email: email.value,
    password: newPassword.value,
    token: token.value
  })

  const requestOptions: RequestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  }

  // Send request to reset password
  try {
    const response = await fetch(`${DOMAIN_NAME}/api/v1/auth/reset-password`, requestOptions)
    if (response.ok) {  // Use response.ok for better readability
      toast('Password reset successfully', {
        theme: 'dark',
        type: 'success',
        dangerouslyHTMLString: true
      })
      router.push('/protected')
    } else {
      const errorData = await response.json()
      toast(errorData.msg || 'An error occurred', {
        theme: 'dark',
        type: 'error',
        dangerouslyHTMLString: true
      })
    }
  } catch (error) {
    console.error(error)
    toast('An error occurred while resetting the password', {
      theme: 'dark',
      type: 'error',
      dangerouslyHTMLString: true
    })
  }
}
</script>

<style lang="scss">
@use '~' as *;

.reset-password-form {
  @include mainMiddleSettings;
@media (max-width: 768px) {
    @include phone-borders;
  }
  >form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20px;

    >* {
      margin: 10px;
      padding: 10px;
    }
  }

  .warn,
  .verify {
    background-color: #007acc;
    color: white;
    padding: 30px;
    position: relative;
    left: 0;
    top: 0;
    border-radius: 4px;
    text-align: center;

    @media screen and (min-width: 769px) {
      margin: auto 50px;
      width: 50%;
      transform: translate(50%, 50%);
    }

    @media screen and (max-width: 768px) {
      margin: 20px;
    }
  }
}
</style>
