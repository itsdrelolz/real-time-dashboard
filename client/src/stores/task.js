import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as taskService from '@/services/taskServices'
import { useChannelStore } from './channel'
import { useProjectStore } from './project'

/**
 * @typedef {import('../types/api.js').Task} Task
 */

export const useTaskStore = defineStore('task', () => {
  const tasks = ref(null)
  const currentTask = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Import other stores
  const channelStore = useChannelStore()
  const projectStore = useProjectStore()

  /**
   * Fetches all tasks for a specific project.
   * @param {number} projectId The ID of the project.
   */
  async function fetchTasksForProject(projectId) {
    if (!projectId) {
      console.error('Project ID is required to fetch tasks.')
      return
    }
    isLoading.value = true
    error.value = null
    try {
      const response = await taskService.getTasksForProject(projectId)
      tasks.value = response.tasks
    } catch (err) {
      console.error(`Fetching tasks for project ${projectId} failed: `, err)
      error.value = err
      tasks.value = [] // Clear tasks on error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetches tasks assigned to a specific user.
   * @param {string} profileId The ID of the profile.
   */
  async function fetchTasksForProfile(profileId) {
    if (!profileId) {
      console.error('Profile ID is required to fetch tasks.')
      return
    }
    isLoading.value = true
    error.value = null
    try {
      const response = await taskService.getTasksForProfile(profileId)
      tasks.value = response.tasks
    } catch (err) {
      console.error(`Fetching tasks for profile ${profileId} failed: `, err)
      error.value = err
      tasks.value = [] // Clear tasks on error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Creates a new task in the currently selected project.
   * @param {{title: string, description?: string, priority?: string, assigneeId?: string}} taskData
   */
  async function createTaskInCurrentProject(taskData) {
    const projectId = projectStore.currentProject?.id

    if (!projectId) {
      throw new Error('A project must be selected to create a task.')
    }

    isLoading.value = true
    error.value = null
    try {
      const response = await taskService.createTask(projectId, taskData)
      const newTask = response.task
      const newChannel = response.channel

      // Add task to tasks list
      if (tasks.value) {
        tasks.value.unshift(newTask)
      } else {
        tasks.value = [newTask]
      }

      // Add the task's channel to channels list
      if (channelStore.channels.value) {
        channelStore.channels.value.unshift(newChannel)
      } else {
        channelStore.channels.value = [newChannel]
      }

      return { task: newTask, channel: newChannel }
    } catch (err) {
      console.error('Creating task failed: ', err)
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Updates a task by its ID.
   * @param {number} taskId
   * @param {object} updateData
   */
  async function updateTask(taskId, updateData) {
    isLoading.value = true
    error.value = null
    try {
      const updatedTask = await taskService.updateTask(taskId, updateData)

      if (tasks.value) {
        const index = tasks.value.findIndex((t) => t.id === taskId)
        if (index !== -1) {
          tasks.value[index] = { ...tasks.value[index], ...updatedTask }
        }
      }

      if (currentTask.value && currentTask.value.id === taskId) {
        currentTask.value = { ...currentTask.value, ...updatedTask }
      }

      return updatedTask
    } catch (err) {
      console.error(`Updating task ${taskId} failed: `, err)
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Deletes a task by its ID.
   * @param {number} taskId
   */
  async function deleteTask(taskId) {
    isLoading.value = true
    error.value = null
    try {
      await taskService.deleteTask(taskId)

      if (tasks.value) {
        tasks.value = tasks.value.filter((t) => t.id !== taskId)
      }

      if (currentTask.value && currentTask.value.id === taskId) {
        currentTask.value = null
      }
    } catch (err) {
      console.error(`Deleting task ${taskId} failed: `, err)
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetches a task with full details including assignee and channel.
   * @param {number} taskId
   */
  async function fetchTaskWithDetails(taskId) {
    isLoading.value = true
    error.value = null
    try {
      const response = await taskService.getTaskWithDetails(taskId)
      currentTask.value = response.task
      return response.task
    } catch (err) {
      console.error(`Fetching task details ${taskId} failed: `, err)
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Clears all task data from the store. Useful when switching projects.
   */
  function clearTasks() {
    tasks.value = null
    currentTask.value = null
    error.value = null
  }

  return {
    tasks,
    currentTask,
    isLoading,
    error,
    fetchTasksForProject,
    fetchTasksForProfile,
    createTaskInCurrentProject,
    updateTask,
    deleteTask,
    fetchTaskWithDetails,
    clearTasks,
  }
})
