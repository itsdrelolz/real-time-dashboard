import apiFetch from './api';

/**
 * Pings the backend's health check endpoint.
 * If the request fails (e.g., network error), it will throw an error.
 * @returns {Promise<{status: string}>}
 */
export function checkBackendHealth() {
  return apiFetch('health');
}
