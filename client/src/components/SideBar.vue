<script setup>
import { watch, computed } from 'vue';
import { useProjectStore } from '@/stores/project';
import { useChannelStore } from '@/stores/channel';
import { storeToRefs } from 'pinia';

const projectStore = useProjectStore();
const channelStore = useChannelStore();

const { currentProject } = storeToRefs(projectStore);
const { channels, isLoading, error: channelError } = storeToRefs(channelStore);

const navLabel = computed(() => (currentProject.value ? 'Channels' : 'Connections'));

function selectChannel(channel) {
  channelStore.currentChannel = channel;
}

watch(currentProject, (newProject) => {
  if (newProject?.id) {
    channelStore.fetchChannelsForProject(newProject.id);
  } else {
    channelStore.clearChannels();
  }
}, { immediate: true });
</script>

<template>
  <div class="nav-container">
    <div class="nav-label">
      {{ navLabel }}
    </div>

    <div v-if="isLoading" class="nav-message">
      Loading...
    </div>
    <div v-else-if="channelError" class="nav-message error">
      Error loading channels.
    </div>

    <template v-else-if="currentProject">
      <div v-if="channels && channels.length > 0">
        <button
          v-for="channel in channels"
          :key="channel.id"
          class="nav-button"
          @click="selectChannel(channel)"
        >
          # {{ channel.name }}
        </button>
      </div>
      <div v-else class="nav-message">
        No channels found.
      </div>
    </template>

    <div v-else class="connections-view">
      <div class="nav-message">
        No connections found.
      </div>
      <button class="nav-button add-connection-button">
        <i class="pi pi-user-plus" style="margin-right: 0.5rem"></i>
        Add Connection
      </button>
    </div>
  </div>
</template>

<style scoped>
.nav-container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem;
  width: 100%;
  height: 100%;
  background-color: var(--p-surface-100, #f8f9fa);
}

.nav-label {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--p-text-color-secondary, #6c757d);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.nav-button {
  width: 100%;
  background-color: transparent;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  font-size: 0.9rem;
  color: var(--p-text-color, #212529);
  padding: 0.75rem;
  text-align: left;
  display: flex;
  align-items: center;
}

.nav-button:hover {
  background-color: var(--p-surface-200, #e9ecef);
}

.nav-message {
  padding: 0.75rem;
  font-size: 0.9rem;
  color: var(--p-text-color-secondary, #6c757d);
}

.nav-message.error {
  color: red;
}

.connections-view {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.add-connection-button {
  background-color: var(--p-green-500, #22c55e);
  color: white;
  justify-content: center;
}

.add-connection-button:hover {
  background-color: var(--p-green-600, #16a34a);
}
</style>
