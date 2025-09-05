export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'support' | 'user'
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role?: string
}

export interface AuthResponse {
  access_token: string
  user: User
}


export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface DashboardStats {
  totalUsers: number
  activeSessions: number
  reportsGenerated: number
  auditLogs: number
}

export interface RecentActivity {
  id: string
  action: string
  time: string
  type: 'login' | 'register' | 'report' | 'update' | 'delete'
  user?: string
}
