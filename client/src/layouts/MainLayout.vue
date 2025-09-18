<template>
  <div class="main-layout">
    <Toolbar class="modern-toolbar">
      <template #start>
        <div class="app-title">
          <h1>Team Task</h1>
        </div>
      </template>

      <template #end>
        <Button
          @click="authStore.signOut()"
          icon="pi pi-sign-out"
          class="logout-button"
          rounded
          text
          severity="danger"
          v-tooltip="'Sign Out'"
        />
      </template>
    </Toolbar>

    <Splitter class="splitter-container" style="border: none; border-radius: 0" :gutter-size="0">
      <SplitterPanel class="main-left-panel" :size="25" :minSize="10">
        <Splitter layout="horizontal" style="height: 100%; border: none" :gutter-size="0">
          <!-- Projects List Panel  -->

          <SplitterPanel class="servers-panel" :size="20">
            <!-- Projects List at Top -->
            <div class="projects-section">
              <!-- Loading State -->
              <div v-if="isLoading" class="loading-container">
                <Skeleton v-for="i in 4" :key="i" shape="circle" size="3rem"></Skeleton>
              </div>

              <!-- Error State -->
              <div v-else-if="error" class="error-container">
                <p>Failed to load projects.</p>
              </div>

              <!-- Projects List -->
              <div v-else-if="projects && projects.length > 0" class="projects-list">
                <Button
                  @click="selectProject(null)"
                  :class="['project-button', 'home-button', { active: !currentProject }]"
                  rounded
                  text
                  icon="pi pi-home"
                  v-tooltip="'Home'"
                />

                <Button
                  v-for="project in projects"
                  :key="project.id"
                  @click="selectProject(project)"
                  :class="[
                    'project-button',
                    'project-item',
                    { active: currentProject?.id === project.id },
                  ]"
                  rounded
                  text
                  v-tooltip="project.name"
                >
                  {{ project.name.charAt(0).toUpperCase() }}
                </Button>
              </div>

              <!-- Empty State -->
              <div v-else class="empty-projects">
                <div class="empty-state">
                  <i class="pi pi-folder-open empty-icon"></i>
                  <p class="empty-text">No projects yet</p>
                </div>
              </div>
            </div>

            <!-- Bottom Section with Add Project and User Info -->
            <div class="bottom-section">
              <!-- Add New Project Button -->
              <div class="add-project-container">
                <Button
                  @click="isModalVisible = true"
                  rounded
                  text
                  class="project-button add-project-button"
                  aria-label="Create New Project"
                  v-tooltip="'Create New Project'"
                >
                  +
                </Button>
              </div>

              <!-- User Info -->
              <Button class="user-info">
                <div class="user-avatar-container">
                  <div class="user-avatar">
                    {{ (authStore.userProfile?.displayName || 'U').charAt(0).toUpperCase() }}
                  </div>
                  <div class="status-indicator online"></div>
                </div>
              </Button>
            </div>
          </SplitterPanel>

          <SplitterPanel :size="75">
            <SideBar />
          </SplitterPanel>
        </Splitter>
      </SplitterPanel>

      <SplitterPanel :size="75">
        <slot />
      </SplitterPanel>
    </Splitter>

    <Dialog
      v-model:visible="isModalVisible"
      modal
      header="Create New Project"
      :style="{ width: '28rem' }"
      class="modern-dialog"
    >
      <div class="dialog-content">
        <div class="form-field">
          <label for="projectName" class="field-label">Project Name</label>
          <InputText
            id="projectName"
            v-model="newProjectName"
            placeholder="Enter project name"
            autocomplete="off"
            class="modern-input"
          />
        </div>
      </div>

      <template #footer>
        <div class="dialog-actions">
          <Button
            type="button"
            label="Cancel"
            severity="secondary"
            @click="isModalVisible = false"
            class="cancel-button"
          />
          <Button
            type="button"
            label="Create Project"
            @click="handleCreateProject"
            :loading="projectStore.isLoading"
            class="create-button"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'

import { useProjectStore } from '@/stores/project'

import { useAuthStore } from '@/stores/auth'

import { storeToRefs } from 'pinia'

import Dialog from 'primevue/dialog'

import SideBar from '@/components/SideBar.vue'

import { joinProjectRoom } from '@/services/socketService'

const projectStore = useProjectStore()

const authStore = useAuthStore()

const { projects, isLoading, error, currentProject } = storeToRefs(projectStore)

const isModalVisible = ref(false)

const newProjectName = ref('')

function selectProject(project) {
  if (project && currentProject.value?.id === project.id) {
    projectStore.currentProject = null
  } else {
    projectStore.currentProject = project
  }
}

async function handleCreateProject() {
  if (!newProjectName.value.trim()) {
    // Maybe show a toast or error message

    return
  }

  try {
    await projectStore.createProject({ name: newProjectName.value })

    newProjectName.value = ''

    isModalVisible.value = false
  } catch (err) {
    console.error('Failed to create project from component', err)
  }
}

onMounted(() => {
  projectStore.fetchAllProjects()
})

// Watch for project changes and join socket room
watch(currentProject, (newProject) => {
  if (newProject?.id) {
    // Add a small delay to ensure socket is connected
    setTimeout(() => {
      joinProjectRoom(newProject.id)
    }, 200)
  }
}, { immediate: true })
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

/* Modern Toolbar Styling */
.modern-toolbar {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 0.75rem 1.5rem;
}

.app-title h1 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logout-button {
  width: 2.5rem;
  height: 2.5rem;
  transition: all 0.2s ease;
}

.logout-button:hover {
  background-color: rgba(239, 68, 68, 0.1);

}

/* Splitter Styling */
.splitter-container {
  flex-grow: 1;
}

.main-left-panel {
  border-right: 1px solid rgba(59, 130, 246, 0.1);
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

.servers-panel {
  border-right: 1px solid rgba(59, 130, 246, 0.1);
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Projects Section at Top */
.projects-section {
  flex: 1;
  padding: 1rem 0.5rem;
  overflow-y: auto;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

/* Bottom Section */
.bottom-section {
  padding: 1rem 0.5rem;
  border-top: 1px solid rgba(59, 130, 246, 0.1);
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.add-project-container {
  display: flex;
  justify-content: center;
}

/* User Info */
.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: rgba(59, 130, 246, 0.05);
  border-radius: 0.75rem;
  border: 1px solid rgba(59, 130, 246, 0.1);
}

.user-avatar-container {
  position: relative;
  display: inline-block;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border: 2px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.status-indicator {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.status-indicator.online {
  background-color: #10b981;
}

.status-indicator.offline {
  background-color: #ef4444;
}

/* Project Buttons */
.project-button {
  width: 3.5rem;
  height: 3.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.project-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(29, 78, 216, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-button:hover::before {
  opacity: 1;
}

.project-button:hover {
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  border-color: rgba(59, 130, 246, 0.3);
}

.project-item {
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  color: #64748b;
}

.project-item.active {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
}

.project-item.active:hover {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
}

.home-button {
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  color: #64748b;
}

.home-button.active {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.home-button.active:hover {
  background: linear-gradient(135deg, #059669, #047857);
}

.add-project-button {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: 2px solid transparent;
  font-size: 1.5rem;
  font-weight: 300;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-project-button:hover {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.add-project-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.35);
}

.add-project-button.p-button-text.p-button {
  color: #3b82f6;
  background: transparent;
}

.add-project-button.p-button-text.p-button:hover {
  color: #1d4ed8;
  background: rgba(59, 130, 246, 0.1);
}

/* Empty State */
.empty-projects {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}

.empty-icon {
  font-size: 2.5rem;
  color: #94a3b8;
  margin-bottom: 0.5rem;
}

.empty-text {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
}

/* Modern Dialog */
.modern-dialog :deep(.p-dialog) {
  border-radius: 1rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

.modern-dialog :deep(.p-dialog-header) {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border-radius: 1rem 1rem 0 0;
  padding: 1.5rem;
}

.dialog-content {
  padding: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.modern-input :deep(.p-inputtext) {
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.modern-input :deep(.p-inputtext:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dialog-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 0 0 1rem 1rem;
}

.cancel-button {
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.create-button {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: none;
  color: white;
}

.create-button:hover {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

/* Loading and Error States */
.servers-panel .p-skeleton {
  margin: 0.5rem auto;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
}

.servers-panel p {
  color: #ef4444;
  text-align: center;
  font-size: 0.875rem;
  margin: 1rem 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modern-toolbar {
    padding: 0.5rem 1rem;
  }

  .user-details {
    display: none;
  }

  .project-button {
    width: 3rem;
    height: 3rem;
    font-size: 1.125rem;
  }

  .servers-panel {
    padding: 0.75rem 0.25rem;
  }
}
</style>
