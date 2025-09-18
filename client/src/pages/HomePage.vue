<template>
  <ChannelView v-if="currentChannel" />
  <TaskView v-else-if="currentTask" />
  <div v-else class="p-6 h-full flex flex-col items-center justify-center text-center">
    <h1 class="text-4xl font-bold mb-4">Welcome to Your Dashboard</h1>
    <p class="text-lg text-gray-600">Select a project and a channel or task to get started!</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useChannelStore } from '@/stores/channel';
import { useTaskStore } from '@/stores/task';
import ChannelView from '@/components/ChannelView.vue';
import TaskView from '@/components/TaskView.vue';

const channelStore = useChannelStore();
const taskStore = useTaskStore();

const currentChannel = computed(() => channelStore.currentChannel);
const currentTask = computed(() => taskStore.currentTask);
</script>

<style scoped>
</style>
