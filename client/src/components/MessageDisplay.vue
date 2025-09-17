<template>
  <div class="message-container">
    <div v-if="isLoading" class="loading-message">
      Loading messages...
    </div>
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>
    <div v-else-if="messages.length === 0" class="no-messages">
      No messages yet. Be the first to say something!
    </div>
    <div v-else class="message-list">
      <div v-for="message in messages" :key="message.id" class="message-item">
        <div class="author">{{ message.author.displayName }}</div>
        <div class="content">{{ message.content }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useMessageStore } from '@/stores/message';

const messageStore = useMessageStore();
const { messages, isLoading, error } = storeToRefs(messageStore);
</script>

<style scoped>
.message-container {
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;
}
.loading-message, .error-message, .no-messages {
  text-align: center;
  color: #6c757d;
}
.message-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.message-item {
  display: flex;
  flex-direction: column;
}
.author {
  font-weight: bold;
  margin-bottom: 0.25rem;
}
.content {
  color: #495057;
}
</style>
