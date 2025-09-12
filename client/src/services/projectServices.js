import apiFetch from '@/services/api'





/*
* Represents a project's data object.
* @typedef {object} ProjectData
* @property {number} id
* @property {string} name
* @property {string} ownerId
* @property {Profile} owner
* @property {ProjectMember[]} members
* @property {Task[]} tasks
* @property {Channel[]} channels
*/



export function getProjects() {
  return apiFetch('/projects', {
    method: 'GET',
    body: JSON.stringify({}),
  })
}



export function getProject(projectId) {
  return apiFetch('projects/{id}', {
    method: 'GET',
    body: JSON.stringify({}),
  })
}



export function createProject() {
  return apiFetch('projects', {
    method: 'POST',
    body: JSON.stringify({}),
  })
}


export function deleteProject() {
  return apiFetch('projects', {
    method: 'DELETE',
    body: JSON.stringify({}),
  })
}
