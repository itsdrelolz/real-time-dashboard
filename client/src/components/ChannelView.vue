<template>
  <div class="channel-view-container">
    <MessageDisplay />
    <MessageInput />
  </div>
</template>

<script setup>
import MessageDisplay from './MessageDisplay.vue';
import MessageInput from './MessageInput.vue';
import { onMounted, watch } from 'vue';
import { useMessageStore } from '@/stores/message';
import { useChannelStore } from '@/stores/channel';

const messageStore = useMessageStore();
const channelStore = useChannelStore();

// Fetch messages when the component is mounted or the channel changes
onMounted(() => {
  if (channelStore.currentChannel?.id) {
    messageStore.fetchMessages(channelStore.currentChannel.id);
  }
});

watch(() => channelStore.currentChannel, (newChannel) => {
  if (newChannel?.id) {
    messageStore.fetchMessages(newChannel.id);
  } else {
    messageStore.clearMessages();
  }
});
</script>

<style scoped>
.channel-view-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
