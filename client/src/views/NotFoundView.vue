<template>
  <div class="not-found">
    <!-- <div class="container"> -->
    <p class="text">404</p>
    <p>This page is not found</p>
    <AppLink aria-label="go to main page" to="/" class="go-back">
      <span> back to main page </span>
    </AppLink>
    <!-- </div> -->
  </div>
</template>

<script setup lang="ts">
// add 404 status code in this 404 page
// it's a server side, so do it in ExpressJs
</script>

<style lang="scss" scoped>
@use '~'as *;
.not-found {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  @include mainMiddleSettings;
  @media (max-width: 768px) {
    @include phone-borders;
  }
  .text {
    font-size: calc($headline-size * 2);
    text-align: center;
    margin: 20px 0;
  }
  p:last-child {
    font-size: $body-text-size;
  }
  .go-back {
    color: $primary1;
    text-decoration: none;
    text-align: center;
    span {
      color: $secondary3;
      text-transform: capitalize;
      font-size: $body-text-size;
    }
  }
}
</style>
