<template>
  <div class="task-list">
    <div class="task-list-header">
      <h3 class="task-list-title">
        <i class="pi pi-list-check"></i>
        Tasks
      </h3>
      <Button
        @click="showCreateTaskModal = true"
        icon="pi pi-plus"
        size="small"
        rounded
        text
        class="add-task-button"
        v-tooltip="'Create New Task'"
      />
    </div>

    <div v-if="isLoading" class="loading-container">
      <Skeleton v-for="i in 3" :key="i" height="2rem" class="mb-2"></Skeleton>
    </div>

    <div v-else-if="error" class="error-container">
      <p class="error-text">{{ error.message }}</p>
    </div>

    <div v-else-if="tasks && tasks.length > 0" class="tasks-container">
      <div
        v-for="task in tasks"
        :key="task.id"
        :class="['task-item', { active: currentTask?.id === task.id }]"
        @click="selectTask(task)"
      >
        <div class="task-content">
          <div class="task-title">{{ task.title }}</div>
          <div class="task-meta">
            <Tag
              :value="task.status"
              :severity="getStatusSeverity(task.status)"
              size="small"
            />
            <Tag
              :value="task.priority"
              :severity="getPrioritySeverity(task.priority)"
              size="small"
            />
          </div>
        </div>
        <div class="task-actions">
          <Button
            @click.stop="editTask(task)"
            icon="pi pi-pencil"
            size="small"
            rounded
            text
            v-tooltip="'Edit Task'"
          />
          <Button
            @click.stop="deleteTask(task.id)"
            icon="pi pi-trash"
            size="small"
            rounded
            text
            severity="danger"
            v-tooltip="'Delete Task'"
          />
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <i class="pi pi-list-check empty-icon"></i>
      <p class="empty-text">No tasks yet</p>
      <p class="empty-subtext">Create your first task to get started</p>
    </div>

    <!-- Create Task Modal -->
    <Dialog
      v-model:visible="showCreateTaskModal"
      modal
      header="Create New Task"
      :style="{ width: '500px' }"
    >
      <CreateTaskForm @task-created="handleTaskCreated" @cancel="showCreateTaskModal = false" />
    </Dialog>

    <!-- Edit Task Modal -->
    <Dialog
      v-model:visible="showEditTaskModal"
      modal
      header="Edit Task"
      :style="{ width: '500px' }"
    >
      <EditTaskForm
        v-if="editingTask"
        :task="editingTask"
        @task-updated="handleTaskUpdated"
        @cancel="showEditTaskModal = false"
      />
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTaskStore } from '@/stores/task'
import { useChannelStore } from '@/stores/channel'
import { storeToRefs } from 'pinia'
import CreateTaskForm from './CreateTaskForm.vue'
import EditTaskForm from './EditTaskForm.vue'

const taskStore = useTaskStore()
const channelStore = useChannelStore()

const { tasks, currentTask, isLoading, error } = storeToRefs(taskStore)

const showCreateTaskModal = ref(false)
const showEditTaskModal = ref(false)
const editingTask = ref(null)

function selectTask(task) {
  taskStore.currentTask = task
  // Fetch channels for this task
  if (task.id) {
    channelStore.fetchChannelsForTask(task.id)
  }
}

function editTask(task) {
  editingTask.value = task
  showEditTaskModal.value = true
}

async function deleteTask(taskId) {
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      await taskStore.deleteTask(taskId)
    } catch (err) {
      console.error('Failed to delete task:', err)
    }
  }
}

function handleTaskCreated(taskData) {
  showCreateTaskModal.value = false
  // Task is already added to the store by the form
}

function handleTaskUpdated(updatedTask) {
  showEditTaskModal.value = false
  editingTask.value = null
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
</script>

<style scoped>
.task-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 0.75rem;
  overflow: hidden;
}

.task-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(59, 130, 246, 0.05);
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
}

.task-list-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.add-task-button {
  color: #3b82f6;
  transition: all 0.2s ease;
}

.add-task-button:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
}

.tasks-container {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.task-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(59, 130, 246, 0.2);
}

.task-item.active {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}

.task-content {
  flex: 1;
  min-width: 0;
}

.task-title {
  font-weight: 500;
  color: #e2e8f0;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-meta {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.task-actions {
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.task-item:hover .task-actions {
  opacity: 1;
}

.loading-container {
  padding: 1rem;
}

.error-container {
  padding: 1rem;
  text-align: center;
}

.error-text {
  color: #ef4444;
  margin: 0;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 1rem;
}

.empty-text {
  color: #94a3b8;
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
}

.empty-subtext {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
}
</style>
