<template>

  <div class="main-layout">

    <Toolbar>

      <template #start>

        <div>

          <Avatar image="https://placehold.co/32x32/EFEFEF/7F7F7F?text=A" style="width: 32px; height: 32px" shape="circle" />

          <span>{{ authStore.userProfile?.displayName }}</span>

        </div>

      </template>



      <template #center>

        <IconField>

          <InputIcon>

            <i class="pi pi-search" />

          </InputIcon>

          <InputText placeholder="Search" />

        </IconField>

      </template>



      <template #end>

        <Button @click="authStore.signOut()" label="Logout" icon="pi pi-sign-out" severity="danger" text />

      </template>

    </Toolbar>



    <Splitter class="splitter-container" style="border: none; border-radius: 0;" :gutter-size="0">

      <SplitterPanel class="main-left-panel" :size="25" :minSize="10">

        <Splitter layout="horizontal" style="height: 100%; border: none;" :gutter-size="0">

          <!-- Projects List Panel (Far Left) -->

          <SplitterPanel class="servers-panel" :size="20">

            <!-- Loading State -->

            <div v-if="isLoading">

              <Skeleton v-for="i in 4" :key="i" shape="circle" size="3rem"></Skeleton>

            </div>



            <!-- Error State -->

            <div v-else-if="error">

              <p>Failed to load projects.</p>

            </div>



            <!-- Projects List -->

            <!-- Gets the first char as projects symbol -->

            <div v-else-if="projects" >

              <Button @click="selectProject(null)" rounded text icon="pi pi-home" class="project-button" />

              <Button v-for="project in projects" :key="project.id" @click="selectProject(project)" rounded text class="project-button">

                {{ project.name.charAt(0).toUpperCase() }}

              </Button>



              <!-- Add New Project Button -->

              <Button @click="isModalVisible = true" rounded text icon="pi pi-plus" class="project-button add-project-button"></Button>

            </div>

            <div v-else>

              <p>No projects found.</p>

              <Button @click="isModalVisible = true" rounded text icon="pi pi-plus" class="project-button add-project-button"></Button>

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



    <Dialog v-model:visible="isModalVisible" modal header="Create New Project" :style="{ width: '25rem' }">

      <div>

        <label for="projectName">Project Name</label>

        <InputText id="projectName" v-model="newProjectName" autocomplete="off" />

      </div>

      <div>

        <Button type="button" label="Cancel" severity="secondary" @click="isModalVisible = false"></Button>

        <Button type="button" label="Create" @click="handleCreateProject" :loading="projectStore.isLoading"></Button>

      </div>

    </Dialog>

  </div>

</template>



<script setup>

import { onMounted, ref } from 'vue';

import { useProjectStore } from '@/stores/project';

import { useAuthStore } from '@/stores/auth';

import { storeToRefs } from 'pinia';

import Dialog from 'primevue/dialog';

import SideBar from '@/components/SideBar.vue'



// --- Pinia Store Setup ---

const projectStore = useProjectStore();

const authStore = useAuthStore();

// Use storeToRefs to keep reactivity on state properties

const { projects, isLoading, error, currentProject } = storeToRefs(projectStore);



const isModalVisible = ref(false);

const newProjectName = ref('');





function selectProject(project) {

  if (project && currentProject.value?.id === project.id) {

    projectStore.currentProject = null;

  } else {

    projectStore.currentProject = project;

  }

}

async function handleCreateProject() {

  if (!newProjectName.value.trim()) {

// Maybe show a toast or error message

    return;

  }

  try {

    await projectStore.createProject({ name: newProjectName.value });

    newProjectName.value = ''; // Reset input

    isModalVisible.value = false; // Close modal on success

  } catch (err) {

    console.error("Failed to create project from component", err);

  }

}



onMounted(() => {

  projectStore.fetchAllProjects();

});

</script>



<style scoped>

.main-layout {

  display: flex;

  flex-direction: column;

  height: 100vh;

  overflow: hidden;

}



.splitter-container {

  flex-grow: 1;

}



.main-left-panel {

  border-right: 1px solid var(--p-surface-border, #e5e7eb);

}



.servers-panel {

  border-right: 1px solid var(--p-surface-border, #e5e7eb);

  background-color: var(--p-surface-100, #f8f9fa);

}



.project-button {

  width: 3rem;

  height: 3rem;

  font-size: 1.25rem;

  transition: all 0.2s ease-in-out;

}



.project-button:hover {

  transform: scale(1.1);

  border-radius: 0.75rem;

}



.add-project-button {

  background-color: var(--p-surface-300, #e0e0e0);

}

</style>

