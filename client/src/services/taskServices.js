import apiFetch from './api'

/**
 * Fetches all tasks for a specific project.
 * @param {number} projectId
 * @returns {Promise<{tasks: Task[]}>}
 */
export function getTasksForProject(projectId) {
  return apiFetch(`projects/${projectId}/tasks`)
}

/**
 * Fetches tasks assigned to a specific user.
 * @param {string} profileId
 * @returns {Promise<{tasks: Task[]}>}
 */
export function getTasksForProfile(profileId) {
  return apiFetch(`profiles/${profileId}/tasks`)
}

/**
 * Fetches a specific task by ID.
 * @param {number} taskId
 * @returns {Promise<{task: Task}>}
 */
export function getTaskById(taskId) {
  return apiFetch(`tasks/${taskId}`)
}

/**
 * Fetches a task with full details including assignee and channel.
 * @param {number} taskId
 * @returns {Promise<{task: Task}>}
 */
export function getTaskWithDetails(taskId) {
  return apiFetch(`tasks/${taskId}/details`)
}

/**
 * Creates a new task in a project.
 * @param {number} projectId
 * @param {object} taskData
 * @param {string} taskData.title
 * @param {string} [taskData.description]
 * @param {'LOW' | 'MEDIUM' | 'HIGH'} [taskData.priority]
 * @param {string} [taskData.assigneeId]
 * @returns {Promise<{task: Task, channel: Channel}>}
 */
export function createTask(projectId, taskData) {
  return apiFetch(`projects/${projectId}/tasks`, {
    method: 'POST',
    body: JSON.stringify(taskData)
  })
}

/**
 * Updates a task.
 * @param {number} taskId
 * @param {object} updateData
 * @returns {Promise<{task: Task}>}
 */
export function updateTask(taskId, updateData) {
  return apiFetch(`tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  })
}

/**
 * Deletes a task.
 * @param {number} taskId
 * @returns {Promise<void>}
 */
export function deleteTask(taskId) {
  return apiFetch(`tasks/${taskId}`, {
    method: 'DELETE'
  })
}
