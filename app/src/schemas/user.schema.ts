import { z } from 'zod'

// User Role Enum
export const UserRole = z.enum(['admin', 'support', 'user'])
export type UserRole = z.infer<typeof UserRole>

// User Status Enum
export const UserStatus = z.enum(['active', 'inactive', 'locked'])
export type UserStatus = z.infer<typeof UserStatus>

// Create User Schema
export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  role: UserRole,
  status: UserStatus,
})

export type CreateUserFormData = z.infer<typeof createUserSchema>

// Update User Schema
export const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  role: UserRole,
  status: UserStatus,
})

export type UpdateUserFormData = z.infer<typeof updateUserSchema>

// Change Role Schema
export const changeRoleSchema = z.object({
  role: UserRole,
})

export type ChangeRoleFormData = z.infer<typeof changeRoleSchema>

// User Query Schema
export const userQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  role: UserRole.optional(),
  status: UserStatus.optional(),
})

export type UserQueryData = z.infer<typeof userQuerySchema>
