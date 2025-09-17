<template>
  <div class="input-container">
    <form @submit.prevent="sendMessage" class="input-form">
      <div class="input-wrapper">
        <Textarea
          v-model="newMessage"
          placeholder="Type a message..."
          class="message-input"
          autocomplete="off"
          rows="1"
          autoResize
          @keydown.enter.prevent="sendMessage"
          @keydown.shift.enter.stop
        />
        <div class="input-actions">
          <Button
            type="button"
            icon="pi pi-paperclip"
            class="attachment-button"
            severity="secondary"
            text
            rounded
            @click="attachFile"
          />
          <Button
            type="submit"
            icon="pi pi-send"
            class="send-button"
            :disabled="!newMessage.trim()"
            severity="primary"
            rounded
          />
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useChannelStore } from '@/stores/channel'
import { socket } from '@/services/socketService'
import { storeToRefs } from 'pinia'

const newMessage = ref('')
const channelStore = useChannelStore()
const { currentChannel } = storeToRefs(channelStore)

const sendMessage = () => {
  if (!newMessage.value.trim() || !currentChannel.value) return

  socket.emit('newChannelMessage', {
    channelId: currentChannel.value.id,
    content: newMessage.value,
  })

  newMessage.value = ''
}

const addNewLine = () => {
  newMessage.value += '\n'
}

const attachFile = () => {
  // Placeholder for file attachment functionality
  console.log('File attachment clicked')
}
</script>

<style scoped>
.input-container {
  padding: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-top: 1px solid rgba(59, 130, 246, 0.1);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  flex: 0 0 auto; /* prevent collapsing and overlapping */
}

.input-form {
  width: 100%;
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 1rem;
  padding: 0.75rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  min-height: 3rem;
  position: relative;
}

.input-wrapper:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.message-input {
  flex: 1;
  border: none !important;
  outline: none !important;
  background: transparent !important;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #1e293b;
  resize: none;
  min-height: 1.5rem;
  max-height: 6rem;
  width: 100%;
  padding: 0 !important;
  margin: 0 !important;
  box-shadow: none !important;
  display: flex;
  align-items: center;
}

.message-input :deep(.p-inputtextarea) {
  border: none !important;
  outline: none !important;
  background: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
  box-shadow: none !important;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #1e293b;
  resize: none;
  min-height: 1.5rem;
  max-height: 6rem;
  width: 100%;
}

.message-input::placeholder,
.message-input :deep(.p-inputtextarea::placeholder) {
  color: #94a3b8;
}

.input-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.attachment-button {
  width: 2.5rem;
  height: 2.5rem;
  color: #64748b;
  transition: all 0.2s ease;
}

.attachment-button:hover {
  color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.1);
}

.send-button {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: none;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.send-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
  transform: translateY(-1px);
}

.send-button:disabled {
  background: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
  box-shadow: none;
}

.send-button:disabled:hover {
  transform: none;
}

/* Custom focus styles for better accessibility */
.message-input:focus {
  outline: none;
}

/* Animation for the input wrapper */
.input-wrapper {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 640px) {
  .input-container {
    padding: 0.75rem;
  }

  .input-wrapper {
    padding: 0.5rem;
  }

  .attachment-button,
  .send-button {
    width: 2.25rem;
    height: 2.25rem;
  }
}
</style>
