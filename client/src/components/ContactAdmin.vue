<template>
  <div>
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
    const response = await fetch('https://baderidris.com/api/v1/received_emails', {
      method: 'GET',
      credentials: 'include' // Includes cookies in the request
    })

    if (response.ok) {
      // Parse and store the response data
      emails.value = await response.json()
      toast('Emails successfully loaded!', {
        theme: 'auto',
        type: 'success',
        position: 'top-center'
      })
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

/*
// I want to do this, getting the cookies from client's browser, using pinia, because I set them using it
// when user logs in, it gets this response from the server:

{
    "user": {
        "name": "bader",
        "userId": "6733a38fea2117443215266b",
        "role": "admin"
    }
}
and it gets the both cookies of: accessToken, refreshToken
then pinia saves it in localStorage as:
{
    "username": "bader",
    "userId": "6733a38fea2117443215266b",
    "role": "admin"
}

So I want the same functionality as the following code, to be applied to my component, to be able to view the emails fo the following http data:

var request = require('request');
var options = {
  'method': 'GET',
  'url': 'https://baderidris.com/api/v1/received_emails',
  'headers': {
    'Cookie': 'accessToken=s%3AeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOiJiYWRlciIsInVzZXJJZCI6IjY3MzNhMzhmZWEyMTE3NDQzMjE1MjY2YiIsInJvbGUiOiJhZG1pbiJ9LCJpYXQiOjE3MzMzOTk3NjR9.BCRjbNpkq-TxH468KI11C2qYm4U84t3ze70KxeHxRDI.SpeGXGUtgWlfEOAhxnVfNpC1w1n9v4X3J9A1BZWBrz0; refreshToken=s%3AeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOiJiYWRlciIsInVzZXJJZCI6IjY3MzNhMzhmZWEyMTE3NDQzMjE1MjY2YiIsInJvbGUiOiJhZG1pbiJ9LCJyZWZyZXNoVG9rZW4iOiJmZDUxMzQwNGIzNGJkYTM1YzdkNTA0M2Q0ZDU4NGFhZDViN2NiMTYzYjMxNzdlODljNWM0ZmM0YmZhODcwYzE0NTJlNDZjY2E3NDk3YzE4NyIsImlhdCI6MTczMzM5OTc2NH0.nwjx0WNmRDaw63P-DGRuD4FK6GFEj3-loK1oh7pP-wQ.FPhgpeSYfJ%2FQGMaFNqO5kOV8EkRIFYrzSuNU7p%2FW7ic'
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});

and I want to use toast for both success and fail messages, similar to this:
toast('Successfully logged in', {
    theme: 'auto',
    type: 'success',// or 'info', 'success', 'warning', 'error' from  import { toast } from 'vue3-toastify'
    position: 'top-center',
    dangerouslyHTMLString: true
  })

these are some responses from the server if res = successful
{
            "_id": "67519470c663a71b455a10fc",
            "name": "bader",
            "email": "contact@baderidris.com",
            "message": "postman yo",
            "ip": "147.189.181.97",
            "createdAt": "2024-12-05T11:54:24.891Z",
            "updatedAt": "2024-12-05T11:54:24.891Z",
            "__v": 0
        },
// I want to use them in the component, to use createdAt, ip, name, email, message, _id
// _id will be for isolating the indexes from each other
*/
</script>
