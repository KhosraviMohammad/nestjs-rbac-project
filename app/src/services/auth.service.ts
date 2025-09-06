import api from './api'
import { AUTH_URLS } from './urls'

// Authentication Service
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post(AUTH_URLS.LOGIN, { email, password })
    return response.data
  },
  register: async (name: string, email: string, password: string) => {
    const response = await api.post(AUTH_URLS.REGISTER, { name, email, password })
    return response.data
  },
}
