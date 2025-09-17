import apiFetch from './api'

/**
 * @typedef {import('../types/api.js').Channel} Channel
 */

/**
 * Fetches all channels for a specific project.
 * This function should be called from a Pinia store or component that already knows the project's ID.
 * @param {number} projectId The ID of the project whose channels are to be fetched.
 * @returns {Promise<{channels: Channel[]}>} An object containing an array of channels.
 */
export function getChannelsForProject(projectId) {
  if (!projectId) {
    throw new Error('Project ID is required to fetch channels.')
  }
  // Correctly calls the nested route: GET /api/projects/:projectId/channels
  return apiFetch(`projects/${projectId}/channels`)
}

/**
 * Creates a new channel within a specific project.
 * @param {number} projectId The ID of the project where the channel will be created.
 * @param {{name: string, description?: string}} channelData The data for the new channel.
 * @returns {Promise<{channel: Channel}>} An object containing the newly created channel.
 */
export function createChannel(projectId, channelData) {
  if (!projectId || !channelData || !channelData.name) {
    throw new Error('Project ID and channel name are required to create a channel.')
  }
  // Correctly calls the nested route: POST /api/projects/:projectId/channels
  return apiFetch(`projects/${projectId}/channels`, {
    method: 'POST',
    // The body includes the name and description. The projectId is in the URL.
    body: JSON.stringify(channelData),
  })
}

/**
 * Deletes a channel by its ID.
 * @param {number} channelId The ID of the channel to delete.
 * @returns {Promise<null>} A promise that resolves when the channel is deleted.
 */
export function deleteChannel(channelId) {
  if (!channelId) {
    throw new Error('Channel ID is required to delete a channel.')
  }
  // Calls the specific channel route: DELETE /api/channels/:channelId
  return apiFetch(`channels/${channelId}`, {
    method: 'DELETE',
  })
}
