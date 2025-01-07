<template>
  <div class="reset-password-form">
    <form @submit.prevent="forgotPassword">
      <h2>add your email to reset the password</h2>
        <label for="email">Email</label>
        <input v-model="email" name="email" type="text" class="input"
          aria-labelledby="email" />
      <CustomButtons button-type="primary" aria-label="Reset Password">
        <span>send email</span>
      </CustomButtons>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import type { RequestOptions } from '@/types/fetch'

// Access route parameters
const router = useRouter()
// State for email, password, and loading
const email = ref<string>('')

const DOMAIN_NAME = 'https://baderidris.com'

if (!email.value) {
  console.error('Email is missing')
}

// Function to reset the password
async function forgotPassword(): Promise<void> {
  if (!email.value) {
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
  })

  const requestOptions: RequestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  }

  // Send request to reset password
  try {
    const response = await fetch(`${DOMAIN_NAME}/api/v1/auth/forgot-password`, requestOptions)
    if (response.ok) {  // Use response.ok for better readability
      toast('email sent successfully', {
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
        margin: 20px auto;
        max-width: 600px;

    >* {
      margin: 10px;
      padding: 10px;
    }
    > label {
          margin-right: 37%;
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
