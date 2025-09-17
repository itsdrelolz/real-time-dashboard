<template>
  <MainLayoutSkeleton v-if="!authStore.authReady" />

  <component :is="layoutComponent" v-else-if="layoutComponent">
    <RouterView />
  </component>

  <RouterView v-else />
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { socket, initializeSocketListeners, connectSocket } from '@/services/socketService';
import { onMounted, watch } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import MainLayoutSkeleton from '@/layouts/MainLayoutSkeleton.vue';

const route = useRoute();
const authStore = useAuthStore();

watch(() => authStore.isLoggedIn, (isLoggedIn) => {
  if (isLoggedIn) {
    connectSocket();
  } else {
    socket.disconnect();
  }
}, { immediate: true });

onMounted(() => {
  initializeSocketListeners();
});



const layouts = {
  MainLayout,
};

const layoutComponent = computed(() => {
  return layouts[route.meta.layout];
});
</script>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
</style>
