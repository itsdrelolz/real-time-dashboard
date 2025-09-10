<template>
  <component :is="layoutComponent">
    <RouterView />
  </component>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AuthLayout from '@/layouts/AuthLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';

const route = useRoute();

const layouts = {
  AuthLayout,
  MainLayout
};

const layoutComponent = computed(() => {
  return layouts[route.meta.layout] || MainLayout;
});
</script>

<style>
body {
  margin: 0;
}
</style>
