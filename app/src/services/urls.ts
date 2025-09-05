// API Base URL
export const API_BASE_URL = 'http://localhost:3000/api/v1'

// Authentication URLs
export const AUTH_URLS = {
  LOGIN: '/auth/login',
} as const

// Users URLs
export const USERS_URLS = {
  LIST: '/admin/users',
  BY_ID: (id: string) => `/admin/users/${id}`,
  LOCK: (id: string) => `/admin/users/${id}/lock`,
  UNLOCK: (id: string) => `/admin/users/${id}/unlock`,
  CHANGE_ROLE: (id: string) => `/admin/users/${id}/role`,
} as const
