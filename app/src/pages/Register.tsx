import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material'
import { 
  Lock as LockIcon, 
  Person as PersonIcon, 
  Email as EmailIcon,
  PersonAdd as PersonAddIcon 
} from '@mui/icons-material'
import { registerSchema, type RegisterFormData } from '../schemas'
import { useRegister } from '../hooks'
import { Link as RouterLink } from 'react-router-dom'

const Register: React.FC = () => {
  const registerMutation = useRegister()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync(data)
      // Redirect or show success message
      console.log('Registration successful!')
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <PersonAddIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography component="h1" variant="h5">
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Sign up to access the admin panel
              </Typography>
            </Box>

            {registerMutation.error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {registerMutation.error.message || 'Registration failed. Please try again.'}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    fullWidth
                    id="name"
                    label="Full Name"
                    autoComplete="name"
                    autoFocus
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />
                )}
              />

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    fullWidth
                    id="email"
                    label="Email Address"
                    autoComplete="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />
                )}
              />
              
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />
                )}
              />

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    autoComplete="new-password"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    InputProps={{
                      startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />
                )}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSubmitting || registerMutation.isPending}
              >
                {isSubmitting || registerMutation.isPending ? (
                  <CircularProgress size={24} />
                ) : (
                  'Create Account'
                )}
              </Button>
            </Box>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" variant="body2">
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}

export default Register
