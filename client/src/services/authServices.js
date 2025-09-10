import apiFetch from './api';


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
