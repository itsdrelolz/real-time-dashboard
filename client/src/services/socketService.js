// client/src/services/socketService.js

import { io } from 'socket.io-client';
import { useMessageStore } from '@/stores/message';
import { supabase } from '@/lib/supabaseClient';

const URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const socket = io(URL, {
  autoConnect: false,
});

/**
 * Call this function to connect the socket, ensuring the auth token is included.
 */
export async function connectSocket() {
  // Get the current session from Supabase
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (token) {
    socket.auth = { token };
    socket.connect();
  } else {
    console.error("Socket connection failed: No auth token available.");
  }
}

export function initializeSocketListeners() {
  const messageStore = useMessageStore();

  socket.on('messageCreated', (newMessage) => {
    messageStore.addMessage(newMessage);
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
  });
}
