import { z } from 'zod'

// User Role Enum (only admin and support)
export const UserRole = z.enum(['admin', 'support'])
export type UserRole = z.infer<typeof UserRole>

// User Status Enum
export const UserStatus = z.enum(['active', 'inactive', 'locked'])
export type UserStatus = z.infer<typeof UserStatus>

// Create User Schema
export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  status: UserStatus,
})

export type CreateUserFormData = z.infer<typeof createUserSchema>

// Update User Schema
export const updateUserSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  status: UserStatus,
})

export type UpdateUserFormData = z.infer<typeof updateUserSchema>

// Change Role Schema
export const changeRoleSchema = z.object({
})

export type ChangeRoleFormData = z.infer<typeof changeRoleSchema>

// User Query Schema
export const userQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  roleType: UserRole.optional(),
  status: UserStatus.optional(),
})

export type UserQueryData = z.infer<typeof userQuerySchema>
