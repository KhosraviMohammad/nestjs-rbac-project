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
