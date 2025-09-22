import { supabase } from '../lib/supabaseClient'


const BASE_URL = import.meta.env.VITE_API_URL

if (!BASE_URL) {
    throw new Error('API URL is not defined')
}

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const { data } = await supabase.auth.getSession() 
  const token = data.session?.access_token // send token to the server on every request

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value
      })
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headers[key] = value
      })
    } else {
      Object.assign(headers, options.headers)
    }
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers,
  }

  const response = await fetch(`${BASE_URL}/api${endpoint}`, config)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(errorData.error || 'An API error occurred')
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export default apiFetch