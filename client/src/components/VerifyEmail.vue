<template>
  <div v-if="verified" class="verify">
    <p>your email's been verified</p>
    <p>
      <span>{{ seconds < 10 ? '0' + seconds : seconds }}</span> seconds to go to the main page
    </p>
  </div>
  <div v-else class="warn">please check your email again</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useRoute } from 'vue-router'

// Access route parameters
const route = useRoute()
const email = ref<string | null>((route.query.email as string) || null)
const token = ref<string | null>((route.query.token as string) || null)

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

  const requestOptions: {
    method: string
    headers: Headers
    body: string
    redirect: 'follow'
  } = {
    // OMG, ts is ugly
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  }

  try {
    const response = await fetch('/api/v1/auth/verify-email', requestOptions)
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
.warn,
.verify {
  margin: auto 50px;
  background-color: #007acc;
  color: white;
  width: 50%;
  padding: 30px;
  transform: translate(50%, 50%);
  position: relative;
  left: 0;
  top: 0;
  border-radius: 4px;
}
</style>
