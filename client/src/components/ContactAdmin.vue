<template>
  <div class="received-set">
    <h1>Admin Panel</h1>
    <ul v-if="emails.length > 0">
      <li v-for="email in emails" :key="email._id">
        <p><strong>From:</strong> {{ email.name }} ({{ email.email }})</p>
        <p><strong>IP:</strong> {{ email.ip }}</p>
        <p><strong>Created At:</strong> {{ new Date(email.createdAt).toLocaleString() }}</p>
        <p>{{ email.message }}</p>
      </li>
    </ul>
    <p v-else>No emails to display.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/UserNameStore'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const DOMAIN_NAME = 'https://baderidris.com'

// Define the type for an email, TODO: move to types dir later
interface Email {
  _id: string
  name: string
  email: string
  message: string
  ip: string
  createdAt: string
}

// State to store emails
const emails = ref<Email[]>([])

// Retrieve the user store
const userStore = useUserStore()

onMounted(async () => {
  try {
    // Ensure the user is logged in and authorized
    if (!userStore.user || userStore.user.role !== 'admin') {
      toast('Unauthorized: You must be an admin to view this page.', {
        theme: 'dark',
        type: 'error',
        position: 'top-center'
      })
      return
    }

    // Make the API request
    const response = await fetch(`${DOMAIN_NAME}/api/v1/received_emails`, {
      method: 'GET',
      credentials: 'include' // Includes cookies in the request
    })

    if (response.ok) {
      // Parse the response data
      const data = await response.json()
      // Check if emails are present in the response
      if (data.emails && Array.isArray(data.emails)) {
        emails.value = data.emails // Set the emails state
        toast('Emails successfully loaded!', {
          theme: 'auto',
          type: 'success',
          position: 'top-center'
        })
      } else {
        toast('No emails found in the response.', {
          theme: 'dark',
          type: 'error',
          position: 'top-center'
        })
      }
    } else {
      // Handle errors with descriptive messages
      const errorText = await response.text()
      toast(`Failed to fetch emails: ${errorText}`, {
        theme: 'dark',
        type: 'error',
        position: 'top-center'
      })
    }
  } catch (error) {
    console.error('Error fetching emails:', error)
    toast('An unexpected error occurred while fetching emails.', {
      theme: 'dark',
      type: 'error',
      position: 'top-center'
    })
  }
})
</script>

<style lang="scss">
@use '~'as *;
.received-set {
  h1 {
    text-align: center;
  }
  ul {
    display: flex;
    flex-direction: column;
    gap: 10px;
    li {
      display: flex;
    }
  }
}
</style>
