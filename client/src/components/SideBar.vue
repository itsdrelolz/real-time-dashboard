<script setup>
import { watch, computed, ref } from 'vue'
import { useProjectStore } from '@/stores/project'
import { useChannelStore } from '@/stores/channel'
import { useTaskStore } from '@/stores/task'
import { storeToRefs } from 'pinia'
import CreateTaskForm from './CreateTaskForm.vue'
import EditTaskForm from './EditTaskForm.vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const projectStore = useProjectStore()
const channelStore = useChannelStore()
const taskStore = useTaskStore()

const { currentProject } = storeToRefs(projectStore)
const { channels, isLoading, error: channelError } = storeToRefs(channelStore)
const { tasks, currentTask, isLoading: tasksLoading } = storeToRefs(taskStore)

const activeTab = ref('channels')
const showCreateTaskModal = ref(false)
const showEditTaskModal = ref(false)
const editingTask = ref(null)

const navLabel = computed(() => {
  if (!currentProject.value) return 'Dms'
  return activeTab.value === 'channels' ? 'Channels' : 'Tasks'
})

const navIcon = computed(() => {
  if (!currentProject.value) return 'pi-users'
  return activeTab.value === 'channels' ? 'pi-hashtag' : 'pi-list-check'
})

function selectChannel(channel) {
  channelStore.currentChannel = channel
  taskStore.currentTask = null
}

function selectTask(task) {
  taskStore.currentTask = task
  channelStore.currentChannel = null
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

function switchTab(tab) {
  activeTab.value = tab
  if (tab === 'channels') {
    channelStore.currentChannel = null
    taskStore.currentTask = null
  } else {
    channelStore.currentChannel = null
    taskStore.currentTask = null
  }
}

watch(
  currentProject,
  (newProject) => {
    if (newProject?.id) {
      if (activeTab.value === 'channels') {
        channelStore.fetchChannelsForProject(newProject.id)
      } else {
        taskStore.fetchTasksForProject(newProject.id)
      }
    } else {
      channelStore.clearChannels()
      taskStore.clearTasks()
    }
  },
  { immediate: true },
)

watch(
  activeTab,
  (newTab) => {
    if (currentProject.value?.id) {
      if (newTab === 'channels') {
        channelStore.fetchChannelsForProject(currentProject.value.id)
      } else {
        taskStore.fetchTasksForProject(currentProject.value.id)
      }
    }
  }
)
</script>

<template>
  <div class="nav-container">
    <div class="nav-header">
      <div class="nav-label">
        <i class="pi" :class="navIcon + ' nav-icon'"></i>
        {{ navLabel }}
      </div>
      <div class="nav-count" v-if="currentProject && activeTab === 'channels' && channels">
        {{ channels.length }}
      </div>
      <div class="nav-count" v-else-if="currentProject && activeTab === 'tasks' && tasks">
        {{ tasks.length }}
      </div>
    </div>

    <!-- Tab Switcher -->
    <div v-if="currentProject" class="tab-switcher">
      <button
        :class="['tab-button', { active: activeTab === 'channels' }]"
        @click="switchTab('channels')"
      >
        <i class="pi pi-hashtag"></i>
        Channels
      </button>
      <button
        :class="['tab-button', { active: activeTab === 'tasks' }]"
        @click="switchTab('tasks')"
      >
        <i class="pi pi-list-check"></i>
        Tasks
      </button>
    </div>

    <div v-if="isLoading || tasksLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <span>Loading...</span>
    </div>

    <div v-else-if="channelError" class="error-state">
      <i class="pi pi-exclamation-triangle error-icon"></i>
      <span>Error loading {{ activeTab }}</span>
    </div>

    <template v-else-if="currentProject">
      <!-- Channels Tab -->
      <div v-if="activeTab === 'channels'">
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
      </div>

      <!-- Tasks Tab -->
      <div v-else-if="activeTab === 'tasks'">
        <div v-if="tasks && tasks.length > 0" class="tasks-list">
          <div
            v-for="task in tasks"
            :key="task.id"
            class="task-item"
            :class="{ active: taskStore.currentTask?.id === task.id }"
          >
            <button
              class="task-button"
              @click="selectTask(task)"
            >
              <i class="pi pi-list-check task-icon"></i>
              <div class="task-content">
                <span class="task-name">{{ task.title }}</span>
                <div class="task-meta">
                  <span class="task-status" :class="'status-' + task.status.toLowerCase()">
                    {{ task.status }}
                  </span>
                  <span class="task-priority" :class="'priority-' + task.priority.toLowerCase()">
                    {{ task.priority }}
                  </span>
                </div>
              </div>
              <div class="task-indicator"></div>
            </button>
            <div class="task-actions">
              <Button
                @click="editTask(task)"
                icon="pi pi-pencil"
                size="small"
                rounded
                text
                v-tooltip="'Edit Task'"
              />
              <Button
                @click="deleteTask(task.id)"
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
        <div v-else class="empty-tasks">
          <i class="pi pi-list-check empty-icon"></i>
          <p class="empty-text">No tasks yet</p>
          <button class="create-task-button" @click="showCreateTaskModal = true">
            <i class="pi pi-plus"></i>
            Create Task
          </button>
        </div>
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


.tab-switcher {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.25rem;
  gap: 0.25rem;
}

.tab-button {
  flex: 1;
  background: transparent;
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 500;
}

.tab-button:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
}

.tab-button.active {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  font-weight: 600;
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

/* Tasks List */
.tasks-list {
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

/* Task Items */
.task-item {
  position: relative;
  margin-bottom: 0.25rem;
}

.task-item:hover .task-actions {
  opacity: 1;
}

.task-button {
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

.task-button:hover {
  background: rgba(59, 130, 246, 0.05);
  color: #1e293b;

}

.task-button.active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(29, 78, 216, 0.1));
  color: #1e293b;
  font-weight: 600;
  border-left: 3px solid #3b82f6;
}

.task-button.active .task-indicator {
  background: #3b82f6;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  position: absolute;
  right: 0.75rem;
  top: 50%;

}

.task-icon {
  font-size: 0.75rem;
  opacity: 0.6;
  color: #94a3b8;
}

.task-content {
  flex: 1;
  min-width: 0;
}

.task-name {
  font-weight: 500;
  display: block;
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

.task-status,
.task-priority {
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.task-status {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.task-status.status-todo {
  background: rgba(100, 116, 139, 0.1);
  color: #64748b;
}

.task-status.status-in_progress {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.task-status.status-done {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.task-status.status-canceled {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.task-priority {
  background: rgba(168, 85, 247, 0.1);
  color: #a855f7;
}

.task-priority.priority-low {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.task-priority.priority-medium {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.task-priority.priority-high {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.task-actions {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.25rem;
  border-radius: 0.375rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}


.empty-channels,
.empty-tasks,
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

.create-channel-button,
.create-task-button {
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

.create-channel-button:hover,
.create-task-button:hover {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);

  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
}


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
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
}

/* Scrollbar */
.channels-list::-webkit-scrollbar,
.tasks-list::-webkit-scrollbar {
  width: 4px;
}

.channels-list::-webkit-scrollbar-track,
.tasks-list::-webkit-scrollbar-track {
  background: transparent;
}

.channels-list::-webkit-scrollbar-thumb,
.tasks-list::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 2px;
}

.channels-list::-webkit-scrollbar-thumb:hover,
.tasks-list::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.5);
}





@media (max-width: 768px) {
  .nav-container {
    margin: 0.25rem;
    border-radius: 0.5rem;
  }

  .nav-header {
    padding: 0.75rem 1rem;
  }

  .channels-list,
  .tasks-list {
    padding: 0.5rem;
  }

  .channel-button,
  .task-button {
    padding: 0.625rem;
  }
}
</style>
