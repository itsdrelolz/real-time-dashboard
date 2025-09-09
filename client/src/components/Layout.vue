<script setup lang="ts">

</script>

<template>
    <div class="layout-wrapper">
    <main class="bulma-container">
      <slot />
    </main>
    </div>
</template>

<style scoped>
  .layout-wrapper {
    background-color: white;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    justify-content: center;
    align-items: center;
  }
</style>
