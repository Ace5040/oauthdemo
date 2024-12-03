<template>
  <RouterView class="content" />
</template>

<script setup lang="ts">
    
  import 'quasar/src/css/index.sass';
  import "./css/reset.css";
  import "./css/all-colors.css";
  import "./css/all-icons.css";
  import "./css/theme-01-base.css";
  import "./css/style.css";
  
</script>

<style scoped lang="scss">
  .content {
    height: calc(100vh - var(--header-height));
  }
</style>
