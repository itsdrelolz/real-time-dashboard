import { io } from 'socket.io-client';
import { useMessageStore } from '@/stores/message';
import { useChannelStore } from '@/stores/channel';
import { useProjectStore } from '@/stores/project';
import { supabase } from '@/lib/supabaseClient';

const URL = import.meta.env.VITE_BASE_URL?.replace('/api', '') || 'http://localhost:3000';

console.log('Socket URL:', URL);

export const socket = io(URL, {
  autoConnect: false,
});

/**
 * Connects the socket with the user's authentication token.
 */
export async function connectSocket() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  console.log("Attempting to connect socket...");
  console.log("Token available:", !!token);
  console.log("Socket URL:", URL);

  if (token) {
    socket.auth = { token };
    socket.connect();
    console.log("Socket connecting with token...");
  } else {
    console.error("Socket connection failed: No auth token available.");
  }
}

/**
 * Tells the server to add this client to a specific project's room.
 * @param {number} projectId The ID of the project to join.
 */
export function joinProjectRoom(projectId) {
  if (socket.connected) {
    socket.emit('joinProjectRoom', projectId);
    console.log(`Joining project room: ${projectId}`);
  } else {
    console.warn(`Socket not connected, cannot join project room: ${projectId}`);
  }
}

/**
 * Initializes all socket event listeners.
 */
export function initializeSocketListeners() {
  const messageStore = useMessageStore();
  const channelStore = useChannelStore();

  socket.on('connect', () => {
    console.log('Socket connected successfully');
    // Rejoin project room if we have a current project (with small delay to ensure connection is stable)
    setTimeout(() => {
      const projectStore = useProjectStore();
      if (projectStore.currentProject?.id) {
        joinProjectRoom(projectStore.currentProject.id);
      }
    }, 100);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('messageCreated', (newMessage) => {
    try {
      console.log('Received message:', newMessage);
      const currentChannelId = channelStore.currentChannel?.id;
      if (!currentChannelId) {
        console.log('No current channel, ignoring message');
        return;
      }
      if (newMessage?.channelId === currentChannelId) {
        console.log('Adding message to current channel');
        messageStore.addMessage(newMessage);
      } else {
        console.log(`Message for channel ${newMessage?.channelId}, current channel is ${currentChannelId}`);
      }
    } catch (e) {
      console.error('Failed to process incoming message', e);
    }
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
  });
}
