<script setup>
import Layout from '@/components/Layout.vue'
import { RouterView } from 'vue-router'
import './styles/main.scss'
</script>

<template>
  <div class="app">
    <Layout>
      <div class="content-body">
        <RouterView />
      </div>
    </Layout>
  </div>
</template>

<style>
.app {
  min-height: 100vh;
  background-color: white;
}

.content-body {
  min-height: 100vh;
}
</style>
