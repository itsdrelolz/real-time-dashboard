<script setup>
import { watch, computed } from 'vue'
import { useProjectStore } from '@/stores/project'
import { useChannelStore } from '@/stores/channel'
import { storeToRefs } from 'pinia'

const projectStore = useProjectStore()
const channelStore = useChannelStore()

const { currentProject } = storeToRefs(projectStore)
const { channels, isLoading, error: channelError } = storeToRefs(channelStore)

const navLabel = computed(() => (currentProject.value ? 'Channels' : 'Connections'))
const navIcon = computed(() => (currentProject.value ? 'pi-hashtag' : 'pi-users'))

function selectChannel(channel) {
  channelStore.currentChannel = channel
}

watch(
  currentProject,
  (newProject) => {
    if (newProject?.id) {
      channelStore.fetchChannelsForProject(newProject.id)
    } else {
      channelStore.clearChannels()
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="nav-container">
    <div class="nav-header">
      <div class="nav-label">
        <i class="pi" :class="navIcon + ' nav-icon'"></i>
        {{ navLabel }}
      </div>
      <div class="nav-count" v-if="currentProject && channels">
        {{ channels.length }}
      </div>
    </div>

    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <span>Loading...</span>
    </div>

    <div v-else-if="channelError" class="error-state">
      <i class="pi pi-exclamation-triangle error-icon"></i>
      <span>Error loading channels</span>
    </div>

    <template v-else-if="currentProject">
      <div v-if="channels && channels.length > 0" class="channels-list">
        <button
          v-for="channel in channels"
          :key="channel.id"
          class="channel-button"
          :class="{ active: channelStore.currentChannel?.id === channel.id }"
          @click="selectChannel(channel)"
        >
          <i class="pi pi-hashtag channel-icon"></i>
          <span class="channel-name">{{ channel.name }}</span>
          <div class="channel-indicator"></div>
        </button>
      </div>
      <div v-else class="empty-channels">
        <i class="pi pi-comments empty-icon"></i>
        <p class="empty-text">No channels yet</p>
        <button class="create-channel-button">
          <i class="pi pi-plus"></i>
          Create Channel
        </button>
      </div>
    </template>

    <div v-else class="connections-view">
      <div class="empty-connections">
        <i class="pi pi-users empty-icon"></i>
        <p class="empty-text">No connections found</p>
        <button class="nav-button add-connection-button">
          <i class="pi pi-user-plus"></i>
          <span>Add Connection</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 0.75rem;
  margin: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Header */
.nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border-radius: 0.75rem 0.75rem 0 0;
}

.nav-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.nav-icon {
  font-size: 0.75rem;
  opacity: 0.8;
}

.nav-count {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 1.5rem;
  text-align: center;
}

/* Loading and Error States */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem 1rem;
  text-align: center;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #e2e8f0;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-icon {
  font-size: 2rem;
  color: #ef4444;
  opacity: 0.6;
}

.loading-state span,
.error-state span {
  color: #64748b;
  font-size: 0.875rem;
}

/* Channels List */
.channels-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem;
  flex: 1;
  overflow-y: auto;
}

.channel-button {
  width: 100%;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.75rem;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  color: #64748b;
  font-size: 0.875rem;
}

.channel-button:hover {
  background: rgba(59, 130, 246, 0.05);
  color: #1e293b;
  transform: translateX(2px);
}

.channel-button.active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(29, 78, 216, 0.1));
  color: #1e293b;
  font-weight: 600;
  border-left: 3px solid #3b82f6;
}

.channel-button.active .channel-indicator {
  background: #3b82f6;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
}

.channel-icon {
  font-size: 0.75rem;
  opacity: 0.6;
  color: #94a3b8;
}

.channel-name {
  flex: 1;
  font-weight: 500;
}

/* Empty States */
.empty-channels,
.empty-connections {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem 1rem;
  text-align: center;
  flex: 1;
}

.empty-icon {
  font-size: 2.5rem;
  color: #94a3b8;
  opacity: 0.6;
}

.empty-text {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
}

.create-channel-button {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.create-channel-button:hover {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
}

/* Connections View */
.connections-view {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.empty-connections {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem 1rem;
  text-align: center;
  flex: 1;
}

.add-connection-button {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
  justify-content: center;
}

.add-connection-button:hover {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
}

/* Scrollbar */
.channels-list::-webkit-scrollbar {
  width: 4px;
}

.channels-list::-webkit-scrollbar-track {
  background: transparent;
}

.channels-list::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 2px;
}

.channels-list::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.5);
}

/* Animations */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-container {
    margin: 0.25rem;
    border-radius: 0.5rem;
  }

  .nav-header {
    padding: 0.75rem 1rem;
  }

  .channels-list {
    padding: 0.5rem;
  }

  .channel-button {
    padding: 0.625rem;
  }
}
</style>
