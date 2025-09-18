<template>
  <div class="task-view-container">
    <div v-if="!currentTask" class="no-task-selected">
      <i class="pi pi-list-check empty-icon"></i>
      <h3>Select a Task</h3>
      <p>Choose a task from the sidebar to view its details and dedicated channel.</p>
    </div>

    <div v-else class="task-details">
      <!-- Task Header -->
      <div class="task-header">
        <div class="task-title-section">
          <h2 class="task-title">{{ currentTask.title }}</h2>
          <div class="task-badges">
            <Tag
              :value="currentTask.status"
              :severity="getStatusSeverity(currentTask.status)"
              size="small"
            />
            <Tag
              :value="currentTask.priority"
              :severity="getPrioritySeverity(currentTask.priority)"
              size="small"
            />
          </div>
        </div>
        <div class="task-actions">
          <Button
            @click="editTask"
            icon="pi pi-pencil"
            size="small"
            rounded
            text
            v-tooltip="'Edit Task'"
          />
          <Button
            @click="deleteTask"
            icon="pi pi-trash"
            size="small"
            rounded
            text
            severity="danger"
            v-tooltip="'Delete Task'"
          />
        </div>
      </div>

      <!-- Task Description -->
      <div v-if="currentTask.description" class="task-description">
        <h4>Description</h4>
        <p>{{ currentTask.description }}</p>
      </div>

      <!-- Task Meta Info -->
      <div class="task-meta-info">
        <div class="meta-item">
          <i class="pi pi-calendar"></i>
          <span>Created: {{ formatDate(currentTask.createdAt) }}</span>
        </div>
        <div class="meta-item">
          <i class="pi pi-clock"></i>
          <span>Updated: {{ formatDate(currentTask.updatedAt) }}</span>
        </div>
        <div v-if="currentTask.assignee" class="meta-item">
          <i class="pi pi-user"></i>
          <span>Assigned to: {{ currentTask.assignee.displayName || currentTask.assignee.email }}</span>
        </div>
      </div>

      <!-- Task Channel -->
      <div class="task-channel-section">
        <h4>Task Discussion</h4>
        <div class="channel-info">
          <i class="pi pi-hashtag"></i>
          <span>This task has its own dedicated channel for focused discussion.</span>
        </div>
        <div v-if="taskChannels && taskChannels.length > 0" class="channel-list">
          <button
            v-for="channel in taskChannels"
            :key="channel.id"
            class="channel-button"
            :class="{ active: channelStore.currentChannel?.id === channel.id }"
            @click="selectChannel(channel)"
          >
            <i class="pi pi-hashtag"></i>
            <span>{{ channel.name }}</span>
          </button>
        </div>
        <div v-else class="no-channels">
          <p>No channels available for this task.</p>
        </div>
      </div>
    </div>

    <!-- Edit Task Modal -->
    <Dialog
      v-model:visible="showEditModal"
      modal
      header="Edit Task"
      :style="{ width: '500px' }"
    >
      <EditTaskForm
        v-if="currentTask"
        :task="currentTask"
        @task-updated="handleTaskUpdated"
        @cancel="showEditModal = false"
      />
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useTaskStore } from '@/stores/task'
import { useChannelStore } from '@/stores/channel'
import { storeToRefs } from 'pinia'
import EditTaskForm from './EditTaskForm.vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const taskStore = useTaskStore()
const channelStore = useChannelStore()

const { currentTask } = storeToRefs(taskStore)
const { channels: taskChannels } = storeToRefs(channelStore)

const showEditModal = ref(false)

function editTask() {
  showEditModal.value = true
}

async function deleteTask() {
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      await taskStore.deleteTask(currentTask.value.id)
    } catch (err) {
      console.error('Failed to delete task:', err)
    }
  }
}

function selectChannel(channel) {
  channelStore.currentChannel = channel
}

function handleTaskUpdated(updatedTask) {
  showEditModal.value = false
  // Task is already updated in the store by the form
}

function getStatusSeverity(status) {
  const severityMap = {
    'TODO': 'info',
    'IN_PROGRESS': 'warning',
    'DONE': 'success',
    'CANCELED': 'danger'
  }
  return severityMap[status] || 'info'
}

function getPrioritySeverity(priority) {
  const severityMap = {
    'LOW': 'info',
    'MEDIUM': 'warning',
    'HIGH': 'danger'
  }
  return severityMap[priority] || 'info'
}

function formatDate(dateString) {
  if (!dateString) return 'Unknown'
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

// Watch for task changes and fetch its channels
watch(currentTask, (newTask) => {
  if (newTask?.id) {
    channelStore.fetchChannelsForTask(newTask.id)
  }
}, { immediate: true })
</script>

<style scoped>
.task-view-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 0.75rem;
  margin: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.no-task-selected {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 2rem;
  color: #64748b;
}

.empty-icon {
  font-size: 4rem;
  color: #cbd5e1;
  margin-bottom: 1rem;
}

.no-task-selected h3 {
  margin: 0 0 0.5rem 0;
  color: #1e293b;
}

.no-task-selected p {
  margin: 0;
  font-size: 0.875rem;
}

.task-details {
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.task-title-section {
  flex: 1;
}

.task-title {
  margin: 0 0 0.75rem 0;
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 600;
}

.task-badges {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.task-header:hover .task-actions {
  opacity: 1;
}

.task-description {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border-left: 4px solid #3b82f6;
}

.task-description h4 {
  margin: 0 0 0.5rem 0;
  color: #1e293b;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.task-description p {
  margin: 0;
  color: #475569;
  line-height: 1.6;
}

.task-meta-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
}

.meta-item i {
  color: #3b82f6;
  font-size: 0.75rem;
}

.task-channel-section {
  border-top: 1px solid #e2e8f0;
  padding-top: 1.5rem;
}

.task-channel-section h4 {
  margin: 0 0 1rem 0;
  color: #1e293b;
  font-size: 1rem;
  font-weight: 600;
}

.channel-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f0f9ff;
  border-radius: 0.5rem;
  color: #0369a1;
  font-size: 0.875rem;
}

.channel-info i {
  color: #0284c7;
}

.channel-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.channel-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
  font-size: 0.875rem;
}

.channel-button:hover {
  background: #f8fafc;
  border-color: #3b82f6;
  color: #1e293b;
}

.channel-button.active {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #1e293b;
  font-weight: 500;
}

.no-channels {
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-style: italic;
}

/* Responsive Design */
@media (max-width: 768px) {
  .task-details {
    padding: 1rem;
  }

  .task-header {
    flex-direction: column;
    gap: 1rem;
  }

  .task-actions {
    opacity: 1;
  }

  .task-meta-info {
    grid-template-columns: 1fr;
  }
}
</style>
