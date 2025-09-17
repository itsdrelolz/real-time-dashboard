

import apiFetch from './api';

/**
 * Fetches the message history for a specific channel.
 *
 * @param {number} channelId The ID of the channel to fetch messages for.
 * @returns {Promise<Message[]>} A promise that resolves to an array of messages.
 */
export function getMessagesForChannel(channelId){
  // This function makes a GET request to your backend endpoint.
  // The endpoint would likely be something like: /api/channels/123/messages
  return apiFetch(`channels/${channelId}/messages`);
}

/**
 * Deletes a message by its ID.
 * (Example for future functionality)
 *
 * @param {number} messageId The ID of the message to delete.
 * @returns {Promise<void>}
 */
export function deleteMessage(messageId) {
  return apiFetch(`messages/${messageId}`, {
    method: 'DELETE',
  });
}

/**
 *
 * @param messageId
 * @returns {Promise<null|any>}
 */
export function updateMessage(messageId) {
  return apiFetch(`messages/${messageId}`, {
    method: 'PATCH', // Or 'PUT'
    body: JSON.stringify({ content: newContent }),
  });
}
