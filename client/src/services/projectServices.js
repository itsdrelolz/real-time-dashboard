import apiFetch from './api'

/**
 * @typedef {import('../types/api.js').Project} Project
 */

/**
 * Fetches summaries for all projects the current user is a member of.
 * @returns {Promise<{projects: Project[]}>} An object containing an array of project summaries.
 */
export function getProjects() {
  // GET /api/projects
  return apiFetch('projects')
}

/**
 * Fetches the detailed information for a single project by its ID.
 * @param {number} projectId The ID of the project to fetch.
 * @returns {Promise<{project: Project}>} An object containing the detailed project data.
 */
export function getProjectById(projectId) {
  // GET /api/projects/:projectId
  return apiFetch(`projects/${projectId}`)
}

/**
 * Creates a new project.
 * This function should receive all necessary data from its caller (e.g., a Pinia store action).
 * @param {{name: string, ownerId: string}} projectData - The complete data for the new project.
 * @returns {Promise<{project: Project}>} An object containing the newly created project.
 */
export function createProject(projectData) {
  // The ownerId is now passed in as an argument, removing the need for the auth store here.
  if (!projectData || !projectData.name || !projectData.ownerId) {
    throw new Error('Project name and ownerId are required to create a project.')
  }

  // POST /api/projects
  return apiFetch('projects', {
    method: 'POST',
    body: JSON.stringify(projectData),
  })
}

/**
 * Updates an existing project's details.
 * @param {number} projectId The ID of the project to update.
 * @param {{name: string}} updateData The data to update.
 * @returns {Promise<Project>} The updated project object.
 */
export function updateProject(projectId, updateData) {
  // PATCH /api/projects/:projectId
  return apiFetch(`projects/${projectId}`, {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  })
}

/**
 * Deletes a project by its ID.
 * @param {number} projectId The ID of the project to delete.
 * @returns {Promise<null>} A promise that resolves when the project is deleted.
 */
export function deleteProject(projectId) {
  // DELETE /api/projects/:projectId
  return apiFetch(`projects/${projectId}`, {
    method: 'DELETE',
  })
}
