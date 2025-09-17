<template>
  <div class="input-container">
    <form @submit.prevent="sendMessage" class="input-form">
      <InputText
        v-model="newMessage"
        placeholder="Type a message..."
        class="message-input"
        autocomplete="off"
      />
      <Button type="submit" icon="pi pi-send" class="send-button" />
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useChannelStore } from '@/stores/channel';
import { socket } from '@/services/socketService';
// 👇 Import the shared socket instance

const newMessage = ref('');
const channelStore = useChannelStore();

const sendMessage = () => {
  if (!newMessage.value.trim() || !channelStore.currentChannel) return;

  // 👇 Use the imported socket to emit the message
  socket.emit('newChannelMessage', {
    channelId: channelStore.currentChannel.id,
    content: newMessage.value
  });

  newMessage.value = '';
};
</script>

<style scoped>
.input-container {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}
.input-form {
  display: flex;
  gap: 0.5rem;
}
.message-input {
  flex-grow: 1;
}
</style>
