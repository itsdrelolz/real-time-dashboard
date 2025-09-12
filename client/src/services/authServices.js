import apiFetch from './api';


/*
* Represents a profile's object data
* @typedef {object} ProfileData
* @property {number} id
* @property {string} email
* @property {string} role
* @property {string} firstName
* @property {string} lastName
* @property {string} displayName
* @property {Project[]} ownedProjects
* @property {ProjectMember[]} memberships
* @property {Message[]} messages
* @property {Conversation[]} conversations
*/



export function login(email, password) {
  return apiFetch('auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}


export function register(email, password, displayName) {
  return apiFetch('auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, displayName }),
  });
}
export function getProfile() {
  // GET is the default method, so we don't need to specify it.
  return apiFetch('auth/me');
}
