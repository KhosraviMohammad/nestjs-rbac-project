import api from './api'
import { USERS_URLS } from './urls'

// Users Service
export const usersService = {
  // لیست کاربران
  getUsers: async (params?: any) => {
    const response = await api.get(USERS_URLS.LIST, { params })
    return response.data
  },
  
  // دریافت کاربر بر اساس ID
  getUser: async (id: string) => {
    const response = await api.get(USERS_URLS.BY_ID(id))
    return response.data
  },
  
  // قفل کردن کاربر
  lockUser: async (id: string) => {
    const response = await api.post(USERS_URLS.LOCK(id))
    return response.data
  },
  
  // باز کردن قفل کاربر
  unlockUser: async (id: string) => {
    const response = await api.post(USERS_URLS.UNLOCK(id))
    return response.data
  },
  
  // تغییر نقش کاربر
  changeUserRole: async (id: string, role: string) => {
    // Backend expects roleType
    const response = await api.patch(USERS_URLS.CHANGE_ROLE(id), { roleType: role })
    return response.data
  },
}
