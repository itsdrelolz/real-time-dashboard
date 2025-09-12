<template>
  <MainLayoutSkeleton v-if="!authStore.authReady" />

  <component :is="layoutComponent" v-else>
    <RouterView />
  </component>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

import AuthLayout from '@/layouts/AuthLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import MainLayoutSkeleton from '@/layouts/MainLayoutSkeleton.vue';

const route = useRoute();
const authStore = useAuthStore();

const layouts = {
  AuthLayout,
  MainLayout,
};

const layoutComponent = computed(() => {
  return layouts[route.meta.layout] || MainLayoutSkeleton;
});
</script>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
</style>
