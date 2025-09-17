import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useProjectStore } from './project';
import * as messageService from '@/services/messageServices';


export const useMessageStore = defineStore('message', () => {
  const messages = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  /**
   * Fetches messages for a specific channel.
   * It now gets the projectId from the projectStore.
   * @param {number} channelId
   * @returns {Promise<void>}
   */
  async function fetchMessages(projechannelId) {
    // Get a reference to the project store
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
      // Use the updated service function that calls the nested endpoint
      const response = await messageService.getMessagesForChannel(projectId, channelId);
      // The backend returns { messages: [...] }, so access the nested array
      messages.value = response.messages;
    } catch (err) {
      error.value = 'Failed to load messages.';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Adds a new message to the state (called by socket listener).
   * @param {import('../types/api').Message} newMessage
   */
  function addMessage(newMessage) {
    messages.value.push(newMessage);
  }

  /**
   * Clears messages from the state.
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
