import { supabase } from '@/lib/supabaseClient'

const BASE_URL = import.meta.env.VITE_BASE_URL

async function apiFetch(endpoint, options = {}) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers,
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config)

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
