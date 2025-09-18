import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as channelService from '@/services/channelServices'
import { useProjectStore } from './project'

/**
 * @typedef {import('../types/api.js').Channel} Channel
 */

export const useChannelStore = defineStore('channel', () => {
  /** @type {import('vue').Ref<Channel[] | null>} */
  const channels = ref(null)
  /** @type {import('vue').Ref<Channel | null>} */
  const currentChannel = ref(null)
  /** @type {import('vue').Ref<boolean>} */
  const isLoading = ref(false)
  /** @type {import('vue').Ref<Error | null>} */
  const error = ref(null)

  /**
   * Fetches all channels for a specific project and populates the `channels` state.
   * @param {number} projectId The ID of the project.
   */
  async function fetchChannelsForProject(projectId) {
    if (!projectId) {
      console.error('Project ID is required to fetch channels.')
      return
    }
    isLoading.value = true
    error.value = null
    try {
      const response = await channelService.getChannelsForProject(projectId)
      channels.value = response.channels
    } catch (err) {
      console.error(`Fetching channels for project ${projectId} failed: `, err)
      error.value = err
      channels.value = [] // Clear channels on error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Creates a new channel in the currently selected project.
   * @param {{name: string, description?: string}} channelData
   */
  async function createChannelInCurrentProject(channelData) {
    const projectStore = useProjectStore()
    const projectId = projectStore.currentProject?.id

    if (!projectId) {
      throw new Error('A project must be selected to create a channel.')
    }

    isLoading.value = true
    error.value = null
    try {
      const response = await channelService.createChannel(projectId, channelData)
      const newChannel = response.channel

      if (channels.value) {
        channels.value.unshift(newChannel)
      } else {
        channels.value = [newChannel]
      }
    } catch (err) {
      console.error('Creating channel failed: ', err)
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Deletes a channel by its ID.
   * @param {number} channelId
   */
  async function deleteChannel(channelId) {
    isLoading.value = true
    error.value = null
    try {
      await channelService.deleteChannel(channelId)
      if (channels.value) {
        channels.value = channels.value.filter((c) => c.id !== channelId)
      }
      if (currentChannel.value && currentChannel.value.id === channelId) {
        currentChannel.value = null
      }
    } catch (err) {
      console.error(`Deleting channel ${channelId} failed: `, err)
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetches all channels for a specific task.
   * @param {number} taskId The ID of the task.
   */
  async function fetchChannelsForTask(taskId) {
    if (!taskId) {
      console.error('Task ID is required to fetch task channels.')
      return
    }
    isLoading.value = true
    error.value = null
    try {
      const response = await channelService.getChannelsForTask(taskId)
      channels.value = response.channels
    } catch (err) {
      console.error(`Fetching channels for task ${taskId} failed: `, err)
      error.value = err
      channels.value = [] // Clear channels on error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Clears all channel data from the store. Useful when switching projects.
   */
  function clearChannels() {
    channels.value = null
    currentChannel.value = null
    error.value = null
  }

  return {
    channels,
    currentChannel,
    isLoading,
    error,
    fetchChannelsForProject,
    fetchChannelsForTask,
    createChannelInCurrentProject,
    deleteChannel,
    clearChannels,
  }
})
