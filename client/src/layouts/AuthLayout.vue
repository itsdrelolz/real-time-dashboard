<template>
  <div class="auth-layout">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
</script>

<style scoped>
.auth-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f7fafc;
}
</style>
