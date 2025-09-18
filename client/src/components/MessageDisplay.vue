<template>
  <div class="message-container" ref="messageContainer">
    <div v-if="isLoading" class="centered-message">
      <div class="loading-spinner"></div>
      <p>Loading messages...</p>
    </div>
    <div v-else-if="error" class="centered-message error">
      <i class="pi pi-exclamation-triangle error-icon"></i>
      <p>{{ error }}</p>
    </div>
    <div v-else-if="!messages || messages.length === 0" class="centered-message">
      <i class="pi pi-comments empty-icon"></i>
      <p>No messages yet. Be the first to say something!</p>
    </div>
    <div v-else class="message-list">
      <template v-for="group in groupedMessages" :key="group.id">
        <!-- Time Divider -->
        <div v-if="group.showDivider" class="time-divider">
          <div class="divider-line"></div>
          <span class="divider-text">{{ formatGroupTimestamp(group.timestamp) }}</span>
          <div class="divider-line"></div>
        </div>

        <!-- Message Group -->
        <div class="message-group">
          <div v-for="message in group.messages" :key="message.id" class="message-item">
            <div class="message-avatar">
              <i class="pi pi-user"></i>
            </div>
            <div class="message-content">
              <div class="message-header">
                <span class="author">{{ message.author?.displayName || message.author?.email || 'Unknown User' }}</span>
                <span class="timestamp">{{ formatTimestamp(message.createdAt) }}</span>
              </div>
              <div class="content">{{ message.content }}</div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMessageStore } from '@/stores/message'

const messageStore = useMessageStore()
const { messages, isLoading, error } = storeToRefs(messageStore)
const messageContainer = ref(null)

// Group messages by 5-hour time windows
const groupedMessages = computed(() => {
  if (!messages.value || messages.value.length === 0) return []

  const groups = []
  let currentGroup = null
  const FIVE_HOURS = 5 * 60 * 60 * 1000 // 5 hours in milliseconds

  messages.value.forEach((message, index) => {
    // Skip messages without required data
    if (!message || !message.createdAt) {
      console.warn('Skipping invalid message:', message)
      return
    }

    const messageTime = new Date(message.createdAt)

    // If this is the first message or if more than 5 hours have passed since the last message
    if (!currentGroup || messageTime - new Date(currentGroup.timestamp) > FIVE_HOURS) {
      // Create a new group
      currentGroup = {
        id: `group-${index}`,
        timestamp: message.createdAt,
        messages: [message],
        showDivider: index > 0, // Show divider for all groups except the first one
      }
      groups.push(currentGroup)
    } else {
      // Add to current group
      currentGroup.messages.push(message)
    }
  })

  return groups
})

const formatTimestamp = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date

  // If less than 1 minute ago
  if (diff < 60000) {
    return 'just now'
  }

  // If less than 1 hour ago
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes}m ago`
  }

  // If today
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  // If yesterday
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  }

  // Otherwise show the date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

const formatGroupTimestamp = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date

  // If less than 1 hour ago
  if (diff < 3600000) {
    return 'Today'
  }

  // If today
  if (date.toDateString() === now.toDateString()) {
    return 'Today'
  }

  // If yesterday
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  }

  // If this week
  const weekAgo = new Date(now)
  weekAgo.setDate(weekAgo.getDate() - 7)
  if (date > weekAgo) {
    return date.toLocaleDateString('en-US', { weekday: 'long' })
  }

  // Otherwise show the full date
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

const scrollToBottom = () => {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

watch(messages, async () => {
  await nextTick()
  scrollToBottom()
}, { deep: true })

onMounted(async () => {
  await nextTick()
  scrollToBottom()
})
</script>

<style scoped>
.message-container {
  flex: 1 1 0;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.centered-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #64748b;
  text-align: center;
}

.centered-message.error {
  color: #ef4444;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #e2e8f0;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 0.5rem;
}

.error-icon,
.empty-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  opacity: 0.6;
}

.error-icon {
  color: #ef4444;
}

.empty-icon {
  color: #3b82f6;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem 0;
  min-height: 0;
}

/* Time Divider */
.time-divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
  position: relative;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
}

.divider-text {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  white-space: nowrap;
}

/* Message Group */
.message-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.message-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
  position: relative;
}

.message-item:hover {
  background-color: rgba(59, 130, 246, 0.02);
}

.message-item:first-child {
  padding-top: 0.75rem;
}

.message-item:last-child {
  padding-bottom: 0.75rem;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.author {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
}

.timestamp {
  font-size: 0.75rem;
  color: #64748b;
  opacity: 0.8;
}

.content {
  color: #334155;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 0.9rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Scrollbar styling for message container */
.message-container::-webkit-scrollbar {
  width: 6px;
}

.message-container::-webkit-scrollbar-track {
  background: transparent;
}

.message-container::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 3px;
}

.message-container::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.5);
}
</style>
