<template>
  <MainLayoutSkeleton v-if="isCheckingHealth || (isBackendHealthy && !authStore.authReady)" />

  <ErrorLayout v-else-if="!isBackendHealthy" />

  <template v-else>
    <component :is="layoutComponent" v-if="layoutComponent">
      <RouterView />
    </component>
    <RouterView v-else />
  </template>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { socket, initializeSocketListeners, connectSocket } from '@/services/socketService';
import { useAppStateStore } from '@/stores/appState';
import MainLayout from '@/layouts/MainLayout.vue';
import MainLayoutSkeleton from '@/layouts/MainLayoutSkeleton.vue';
import ErrorLayout from '@/layouts/ErrorLayout.vue';
import { storeToRefs } from 'pinia'
const route = useRoute();
const authStore = useAuthStore();
const appStateStore = useAppStateStore();

const { isBackendHealthy, isCheckingHealth } = storeToRefs(appStateStore);
const layouts = {
  MainLayout,
};

const layoutComponent = computed(() => {
  return layouts[route.meta.layout];
});

onMounted(() => {
  appStateStore.performHealthCheck();
});

onMounted(() => {
  initializeSocketListeners();
});


watch(() => authStore.isLoggedIn, (isLoggedIn) => {
  if (isLoggedIn && !socket.connected) {
    connectSocket();
  } else if (!isLoggedIn && socket.connected) {
    socket.disconnect();
  }
}, { immediate: true });
</script>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
</style>
