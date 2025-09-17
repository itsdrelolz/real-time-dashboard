<template>
  <ChannelView v-if="currentChannel" />

  <div v-else class="p-6 h-full flex flex-col items-center justify-center text-center">
    <h1 class="text-4xl font-bold mb-4">Welcome to Your Dashboard</h1>
    <p class="text-lg text-gray-600">Select a project and a channel to get started!</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useChannelStore } from '@/stores/channel';
import ChannelView from '@/components/ChannelView.vue';

const channelStore = useChannelStore();
const currentChannel = computed(() => channelStore.currentChannel);
</script>

<style scoped>
</style>
