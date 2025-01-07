<template>
  <div class="verify-comp">
    <div v-if="verified" class="verify">
      <p>your email's been verified</p>
      <p>
        <span>{{ seconds < 10 ? '0' + seconds : seconds }}</span> seconds to go to the main page
      </p>
    </div>
    <div v-else class="warn">
      <p>please check your email again</p>
      <CustomButtons class="go-back" button-type="primary" aria-label="go to main page">
        <AppLink to="/">
          <span> or go back to main page </span>
        </AppLink>
      </CustomButtons>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import type { RequestOptions } from '@/types/fetch'
import { useRoute, useRouter } from 'vue-router'

// Access route parameters
const route = useRoute()
const router = useRouter()
const email = ref<string | null>((route.query.email as string) || null)
const token = ref<string | null>((route.query.token as string) || null)
const DOMAIN_NAME = 'https://baderidris.com'

// Initialize reactive properties
const seconds = ref<number>(10)
const verified = ref<boolean>(false)

// Ensure email and token exist
if (!email.value || !token.value) {
  console.error('Email or token query parameters are missing')
}

// Countdown logic for the remaining seconds
function remaining(): void {
  const intervalId = setInterval(() => {
    seconds.value--
    if (seconds.value === 0) {
      clearInterval(intervalId)
      if (verified.value) {
        // Redirect to the main page when countdown ends
        router.push('/')
      }
    }
  }, 1000)
}

// Function to verify the email
async function verifyEmail(): Promise<void> {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  const raw = JSON.stringify({
    email: email.value,
    verificationToken: token.value
  })

  const requestOptions: RequestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  }

  try {
    const response = await fetch(`${DOMAIN_NAME}/api/v1/auth/verify-email`, requestOptions)
    if (response.status === 200) {
      const result = await response.json()
      verified.value = true
      console.log(result)
      toast('Email verified successfully', {
        theme: 'dark',
        type: 'success',
        dangerouslyHTMLString: true
      })
    } else if (response.status === 401) {
      const errorData = await response.json()
      toast(errorData.msg, {
        theme: 'dark',
        type: 'error',
        dangerouslyHTMLString: true
      })
      verified.value = false
    }
  } catch (error) {
    console.error(error)
    verified.value = false
  }
}

// Mounted lifecycle hook to start countdown and email verification
onMounted(() => {
  remaining()
  verifyEmail()
})
</script>

<style lang="scss">
@use '~'as *;

.verify-comp {
  @include mainMiddleSettings;
  @media (max-width: 768px) {
    @include phone-borders;
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
  .warn {
    @media screen and (max-width: 768px) {
      // width: 100%;
      // left: 0;
    }
  }
}
</style>
