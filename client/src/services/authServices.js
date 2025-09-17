import apiFetch from './api'

/**
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{profile: import('./types/api.js').Profile, session: import('./types/api.js').SupabaseSession}>}
 */

export function login(email, password) {
  return apiFetch('auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

/**
 * @param {string} email
 * @param {string} password
 * @param {string} displayName
 * @returns {Promise<{profile: import('./types/api.js').Profile, session: import('./types/api.js').SupabaseSession}>}
 */

export function register(email, password, displayName) {
  return apiFetch('auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, displayName }),
  })
}

/**
 * @returns {Promise<import('./types/api.js').Profile>}
 */
export function getProfile() {
  return apiFetch('auth/me')
}
