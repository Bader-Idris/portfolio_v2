<template>
  <div class="protected">
    <h1>Greetings, {{username}}</h1>
    <button @click="logout">Logout</button>
    <router-link :to="{name: 'invoices'}">
      <button>Invoices</button>
    </router-link>
  </div>
</template>
<script>
export default {
  data(){
    return {
      username: window.user
    }
  },
  methods:{
    logout(){//! fix it
      window.user = null
      this.$router.push({name: 'Home', query: {logout: null}})
    }
  }
}
</script>

<style lang="scss">
@use '~' as *;
.protected {
  display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    @include mainMiddleSettings;

    @media (max-width: 768px) {
      @include phone-borders;
    }
}
</style>
