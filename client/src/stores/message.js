import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useProjectStore } from './project';
import * as messageService from '@/services/messageServices';

/**
 * @typedef {import('../types/api.js').Message} Message
 */

export const useMessageStore = defineStore('message', () => {
  const messages = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  /**
   * Fetches messages for a specific channel, using the currently active project.
   * @param {number} channelId
   * @returns {Promise<void>}
   */
  async function fetchMessages(channelId) {
    const projectStore = useProjectStore();
    const projectId = projectStore.currentProject?.id;

    if (!projectId) {
      error.value = 'Cannot fetch messages without a selected project.';
      console.error(error.value);
      return;
    }

    isLoading.value = true;
    error.value = null;
    try {
      const response = await messageService.getMessagesForChannel(projectId, channelId);
      messages.value = (response.messages || []).slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } catch (err) {
      error.value = 'Failed to load messages.';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Adds a new message to the state (called by the socket listener).
   * @param {Message} newMessage
   */
  function addMessage(newMessage) {
    messages.value.push(newMessage);
  }

  /**
   * Clears all messages from the state.
   */
  function clearMessages() {
    messages.value = [];
    error.value = null;
  }

  return {
    messages,
    isLoading,
    error,
    fetchMessages,
    addMessage,
    clearMessages,
  };
});
