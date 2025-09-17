import { io } from 'socket.io-client';
import { useMessageStore } from '@/stores/message';
import { useChannelStore } from '@/stores/channel';
import { supabase } from '@/lib/supabaseClient';

const URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const socket = io(URL, {
  autoConnect: false,
});

/**
 * Connects the socket with the user's authentication token.
 */
export async function connectSocket() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (token) {
    socket.auth = { token };
    socket.connect();
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
  }
}

/**
 * Initializes all socket event listeners.
 */
export function initializeSocketListeners() {
  const messageStore = useMessageStore();
  const channelStore = useChannelStore();

  socket.on('messageCreated', (newMessage) => {
    try {
      const currentChannelId = channelStore.currentChannel?.id;
      if (!currentChannelId) return;
      if (newMessage?.channelId === currentChannelId) {
        messageStore.addMessage(newMessage);
      }
    } catch (e) {
      console.error('Failed to process incoming message', e);
    }
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
  });
}
