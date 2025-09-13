import { ref } from 'vue';
import { defineStore } from 'pinia';
import * as projectService from '@/services/projectServices';

/**
 * @typedef {import('../types/api.js').Project} Project
 */

export const useProjectStore = defineStore('project', () => {
  /**
   * Holds the list of project summaries for the current user.
   * @type {import('vue').Ref<Project[] | null>}
   */
  const projects = ref(null);

  /**
   * Holds the currently selected/viewed detailed project data.
   * @type {import('vue').Ref<Project | null>}
   */
  const currentProject = ref(null);

  /**
   * Indicates if an API call related to projects is in progress.
   * @type {import('vue').Ref<boolean>}
   */
  const isLoading = ref(false);

  /**
   * Holds any error that occurred during a project-related API call.
   * @type {import('vue').Ref<Error | null>}
   */
  const error = ref(null);

  /**
   * Fetches all project summaries for the logged-in user and populates the `projects` state.
   */
  async function fetchAllProjects() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await projectService.getProjects();
      projects.value = response.projects;
    } catch (err) {
      console.error('Fetching projects failed: ', err);
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Fetches a single project by its ID and populates the `currentProject` state.
   * @param {number} projectId
   */
  async function fetchProjectById(projectId) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await projectService.getProjectById(projectId);
      currentProject.value = response.project;
    } catch (err) {
      console.error(`Fetching project ${projectId} failed: `, err);
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Creates a new project.
   * @param {{name: string}} projectData
   */
  async function createProject(projectData) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await projectService.createProject(projectData);
      // Add the new project to the start of the list for immediate UI update
      if (projects.value) {
        projects.value.unshift(response.newProject);
      } else {
        projects.value = [response.newProject];
      }
    } catch (err) {
      console.error('Creating project failed: ', err);
      error.value = err;
      throw err; // Re-throw to be caught in the component if needed
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Updates an existing project.
   * @param {number} projectId
   * @param {{name: string}} updateData
   */
  async function updateProject(projectId, updateData) {
    isLoading.value = true;
    error.value = null;
    try {
      const updatedProject = await projectService.updateProject(projectId, updateData);
      // Update the project in the main list
      if (projects.value) {
        const index = projects.value.findIndex(p => p.id === projectId);
        if (index !== -1) {
          projects.value[index] = { ...projects.value[index], ...updatedProject };
        }
      }
      // If the updated project is the current one, update it too
      if (currentProject.value && currentProject.value.id === projectId) {
        currentProject.value = { ...currentProject.value, ...updatedProject };
      }
    } catch (err) {
      console.error(`Updating project ${projectId} failed: `, err);
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Deletes a project.
   * @param {number} projectId
   */
  async function deleteProject(projectId) {
    isLoading.value = true;
    error.value = null;
    try {
      await projectService.deleteProject(projectId);
      // Remove the project from the list for immediate UI update
      if (projects.value) {
        projects.value = projects.value.filter(p => p.id !== projectId);
      }
      if (currentProject.value && currentProject.value.id === projectId) {
        currentProject.value = null;
      }
    } catch (err) {
      console.error(`Deleting project ${projectId} failed: `, err);
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    projects,
    currentProject,
    isLoading,
    error,
    fetchAllProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject,
  };
});
