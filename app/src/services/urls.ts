

// Authentication URLs
export const AUTH_URLS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
} as const

// Users URLs
export const USERS_URLS = {
  LIST: '/admin/users',
  BY_ID: (id: string) => `/admin/users/${id}`,
  LOCK: (id: string) => `/admin/users/${id}/lock`,
  UNLOCK: (id: string) => `/admin/users/${id}/unlock`,
  CHANGE_ROLE: (id: string) => `/admin/users/${id}/role`,
} as const
