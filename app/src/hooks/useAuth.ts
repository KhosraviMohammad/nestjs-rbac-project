import { useMutation } from '@tanstack/react-query'
import { authService } from '../services/auth.service'

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (data) => {
      // Store token in localStorage
      if (data.access_token) {
        localStorage.setItem('authToken', data.access_token)
      }
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: ({ firstName, lastName, email, password }: { firstName: string; lastName: string; email: string; password: string }) =>
      authService.register(firstName, lastName, email, password),
    onSuccess: (data) => {
      // Store token in localStorage if registration returns a token
      if (data.access_token) {
        localStorage.setItem('authToken', data.access_token)
      }
      console.log('Registration successful!', data)
    },
    onError: (error) => {
      console.error('Registration failed:', error)
    },
  })
}