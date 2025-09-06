import api from './api'
import { AUTH_URLS } from './urls'

// Authentication Service
export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post(AUTH_URLS.LOGIN, { username, password })
    return response.data
  },
  register: async (firstName: string, lastName: string, email: string, password: string) => {
    const response = await api.post(AUTH_URLS.REGISTER, { firstName, lastName, email, password })
    return response.data
  },
}
