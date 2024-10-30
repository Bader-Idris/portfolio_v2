<template>
  <div class="not-found">
    <!-- <div class="container"> -->
    <p class="text">404</p>
    <AppLink to="/" class="internal-link">
      <span> back to main page </span>
    </AppLink>
    <!-- </div> -->
  </div>
</template>

<style lang="scss" scoped>
@use '~'as *;
.not-found {
  display: flex;
  justify-content: center;
  flex-direction: column;
  @include mainMiddleSettings;
  @media (max-width: 768px) {
    @include phone-borders;
  }
  .text {
    font-size: calc($headline-size * 2);
    text-align: center;
    margin: 20px 0;
  }
  a {
    color: $primary1;
    text-decoration: none;
    text-align: center;
    span {
      color: $secondary3;
      font-size: $body-text-size;
    }
  }
}
</style>
