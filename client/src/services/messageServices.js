import apiFetch from './api';

/**
 * @typedef {import('../types/api.js').Message} Message
 */

/**
 * Fetches the message history for a specific channel within a project.
 *
 * @param {number} projectId The ID of the project.
 * @param {number} channelId The ID of the channel.
 * @returns {Promise<{messages: Message[]}>} A promise that resolves to an object containing an array of messages.
 */
export function getMessagesForChannel(projectId, channelId) {
  // Correctly build the nested URL
  return apiFetch(`projects/${projectId}/channels/${channelId}/messages`);
}

/**
 * Deletes a message by its ID.
 *
 * @param {number} projectId The ID of the project.
 * @param {number} channelId The ID of the channel where the message exists.
 * @param {number} messageId The ID of the message to delete.
 * @returns {Promise<null>}
 */
export function deleteMessage(projectId, channelId, messageId) {
  // This endpoint would need to exist on your backend, following the nested convention
  return apiFetch(`projects/${projectId}/channels/${channelId}/messages/${messageId}`, {
    method: 'DELETE',
  });
}

/**
 * Updates the content of an existing message.
 *
 * @param {number} projectId The ID of the project.
 * @param {number} channelId The ID of the channel where the message exists.
 * @param {number} messageId The ID of the message to update.
 * @param {string} newContent The new content for the message.
 * @returns {Promise<Message>} A promise that resolves to the updated message.
 */
export function updateMessage(projectId, channelId, messageId, newContent) {
  return apiFetch(`projects/${projectId}/channels/${channelId}/messages/${messageId}`, {
    method: 'PATCH',
    body: JSON.stringify({ content: newContent }),
  });
}
