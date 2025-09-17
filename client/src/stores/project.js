import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as projectService from '@/services/projectServices'
import { useAuthStore } from './auth'

/**
 * @typedef {import('../types/api.js').Project} Project
 */

export const useProjectStore = defineStore('project', () => {
  const projects = ref(null)
  const currentProject = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  async function fetchAllProjects() {
    isLoading.value = true
    error.value = null
    try {
      const response = await projectService.getProjects()
      projects.value = response.projects
    } catch (err) {
      console.error('Fetching projects failed: ', err)
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProjectById(projectId) {
    isLoading.value = true
    error.value = null
    try {
      const response = await projectService.getProjectById(projectId)
      currentProject.value = response.project
    } catch (err) {
      console.error(`Fetching project ${projectId} failed: `, err)
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Creates a new project.
   * @param {{name: string}} projectData - Contains the project's name from the form.
   */
  async function createProject(projectData) {
    const authStore = useAuthStore()
    const ownerId = authStore.user?.id

    if (!ownerId) {
      throw new Error('User must be logged in to create a project.')
    }

    isLoading.value = true
    error.value = null
    try {
      const response = await projectService.createProject({ ...projectData, ownerId })

      const newProject = response.project
      if (projects.value) {
        projects.value.unshift(newProject)
      } else {
        projects.value = [newProject]
      }
    } catch (err) {
      console.error('Creating project failed in store: ', err)
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateProject(projectId, updateData) {
    isLoading.value = true
    error.value = null
    try {
      const updatedProject = await projectService.updateProject(projectId, updateData)
      if (projects.value) {
        const index = projects.value.findIndex((p) => p.id === projectId)
        if (index !== -1) {
          projects.value[index] = { ...projects.value[index], ...updatedProject }
        }
      }
      if (currentProject.value && currentProject.value.id === projectId) {
        currentProject.value = { ...currentProject.value, ...updatedProject }
      }
    } catch (err) {
      console.error(`Updating project ${projectId} failed: `, err)
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteProject(projectId) {
    isLoading.value = true
    error.value = null
    try {
      await projectService.deleteProject(projectId)
      if (projects.value) {
        projects.value = projects.value.filter((p) => p.id !== projectId)
      }
      if (currentProject.value && currentProject.value.id === projectId) {
        currentProject.value = null
      }
    } catch (err) {
      console.error(`Deleting project ${projectId} failed: `, err)
      error.value = err
    } finally {
      isLoading.value = false
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
  }
})
