

import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/services/api';



export const useMessageStore = defineStore('message', () => {

  const messages = ref([]);
  const isLoading = ref(false);
  const error = ref(null);


  /**
   *
   * @param channelId
   * @returns {Promise<void>}
   */
  async function fetchMessages(channelId) {
    isLoading.value = true;
    error.value = null;
    try {

      const response = await api.get(`/channels/${channelId}/messages`);
      messages.value = response.data;
    } catch (err) {
      error.value = 'Failed to load messages.';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  }

  /**
   *
    * @param newMessage
   */
  function addMessage(newMessage) {
    messages.value.push(newMessage);
  }

  function clearMessages() {
    messages.value = [];
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
