<template>
  <div class="channel-view-container">
    <MessageDisplay />
    <MessageInput />
  </div>
</template>

<script setup>
import MessageDisplay from './MessageDisplay.vue';
import MessageInput from './MessageInput.vue';
import { watch } from 'vue';
import { useMessageStore } from '@/stores/message';
import { useChannelStore } from '@/stores/channel';
import { storeToRefs } from 'pinia';

const messageStore = useMessageStore();
const channelStore = useChannelStore();
const { currentChannel } = storeToRefs(channelStore);

watch(currentChannel, (newChannel) => {
  if (newChannel?.id) {
    messageStore.fetchMessages(newChannel.id);
  } else {
    messageStore.clearMessages();
  }
}, { immediate: true });
</script>

<style scoped>
.channel-view-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0; /* allow children with overflow to shrink */
  overflow: hidden;
  background-color: #ffffff;
}
</style>
