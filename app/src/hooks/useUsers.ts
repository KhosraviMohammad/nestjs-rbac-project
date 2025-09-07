import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersService } from '../services/users.service'

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: any) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

// Get Users List
export const useUsers = (params?: any) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => usersService.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get Single User
export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersService.getUser(id),
    enabled: !!id,
  })
}

// Lock User Mutation
export const useLockUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => usersService.lockUser(id),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
    onError: (error) => {
      console.error('Lock user failed:', error)
    },
  })
}

// Unlock User Mutation
export const useUnlockUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => usersService.unlockUser(id),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
    onError: (error) => {
      console.error('Unlock user failed:', error)
    },
  })
}

// Create User Mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (userData: any) => usersService.createUser(userData),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
    onError: (error) => {
      console.error('Create user failed:', error)
    },
  })
}

// Update User Mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: any }) => 
      usersService.updateUser(id, userData),
    onSuccess: (_, { id }) => {
      // Invalidate and refetch users list and specific user detail
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) })
    },
    onError: (error) => {
      console.error('Update user failed:', error)
    },
  })
}

// Change User Role Mutation
export const useChangeUserRole = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      usersService.changeUserRole(id, role),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
    onError: (error) => {
      console.error('Change user role failed:', error)
    },
  })
}
