import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TextField, Button, Box, CircularProgress } from '@mui/material'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserSchema, updateUserSchema, type CreateUserFormData, type UpdateUserFormData, UserStatus } from '@/schemas'
import { useUser, useCreateUser, useUpdateUser } from '@/hooks'
import { toast } from 'react-toastify'

type UserFormProps = {
  userId?: number
  onSubmit: (data: CreateUserFormData | UpdateUserFormData) => void
  onCancel: () => void
  submitLabel?: string
  isLoading?: boolean
}

const UserForm: React.FC<UserFormProps> = ({ userId, onSubmit, onCancel, submitLabel = 'Create', isLoading = false }) => {
  const { data: user } = useUser(userId?.toString() || '')
  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()

  const form = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(userId ? updateUserSchema : createUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      status: 'active',
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email,
        status: (user.isActive ? 'active' : 'inactive') as UserStatus,
      })
    }
  }, [user, form])

  const handleSubmit = async (data: CreateUserFormData | UpdateUserFormData) => {
    try {
      if (userId) {
        // Update user
        await updateUserMutation.mutateAsync({
          id: userId.toString(),
          userData: {
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
            email: data.email,
          }
        })
        toast.success('User updated successfully!')
      } else {
        // Create user
        await createUserMutation.mutateAsync({
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          email: data.email,
          password: 'defaultPassword123', // You might want to add password field
        })
        toast.success('User created successfully!')
      }
      onSubmit(data)
    } catch (error: any) {
      console.error('User operation failed:', error)
      toast.error(error?.response?.data?.message || 'Operation failed. Please try again.')
    }
  }

  const isSubmitting = form.formState.isSubmitting || createUserMutation.isPending || updateUserMutation.isPending || isLoading

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Controller
        name="firstName"
        control={form.control as any}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="First Name"
            margin="normal"
            error={!!(form as any).formState.errors.firstName}
            helperText={(form as any).formState.errors.firstName?.message as string}
          />
        )}
      />
      <Controller
        name="lastName"
        control={form.control as any}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Last Name"
            margin="normal"
            error={!!(form as any).formState.errors.lastName}
            helperText={(form as any).formState.errors.lastName?.message as string}
          />
        )}
      />
      <Controller
        name="username"
        control={form.control as any}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Username"
            margin="normal"
            error={!!(form as any).formState.errors.username}
            helperText={(form as any).formState.errors.username?.message as string}
          />
        )}
      />
      <Controller
        name="email"
        control={form.control as any}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            error={!!(form as any).formState.errors.email}
            helperText={(form as any).formState.errors.email?.message as string}
          />
        )}
      />
      
      <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
        <Button
          type="button"
          variant="outlined"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <CircularProgress size={20} />
          ) : (
            submitLabel
          )}
        </Button>
      </Box>
    </form>
  )
}

export default UserForm