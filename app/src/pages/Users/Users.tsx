import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Typography, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Person as PersonIcon, Lock as LockIcon, LockOpen as LockOpenIcon } from '@mui/icons-material'
import { changeRoleSchema, type ChangeRoleFormData, UserRole } from '@/schemas'
import UserForm from './components/UserForm'
import { useUsers, useLockUser, useUnlockUser, useChangeUserRole } from '@/hooks'
import { toast } from 'react-toastify'

interface User {
  id: number
  username?: string
  firstName?: string
  lastName?: string
  email: string
  roleType?: string
  isActive?: boolean
  createdAt: string
}

const Users: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [roleChangeUser, setRoleChangeUser] = useState<User | null>(null)

  // React Query hooks
  const { data: usersResponse, isLoading, error } = useUsers()
  const lockUserMutation = useLockUser()
  const unlockUserMutation = useUnlockUser()
  const changeRoleMutation = useChangeUserRole()

  // Form handlers
  const handleUserSubmit = () => {
    // Form submission is now handled by UserForm component
    handleClose()
  }

  const roleForm = useForm<ChangeRoleFormData>({
    resolver: zodResolver(changeRoleSchema),
    defaultValues: {
      role: 'support',
    },
  })

  const handleOpen = (user?: User) => {
    setEditingUser(user || null)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditingUser(null)
  }

  const handleRoleChange = (user: User) => {
    setRoleChangeUser(user)
    roleForm.reset({ role: (user.roleType || 'support') as UserRole })
  }

  const handleRoleSubmit = async (data: ChangeRoleFormData) => {
    if (roleChangeUser) {
      try {
        await changeRoleMutation.mutateAsync({
          id: roleChangeUser.id.toString(),
          role: data.role,
        })
        toast.success('User role changed successfully!')
        setRoleChangeUser(null)
      } catch (error: any) {
        console.error('Role change failed:', error)
        toast.error(error?.response?.data?.message || 'Failed to change user role. Please try again.')
      }
    }
  }

  const handleLock = async (id: number) => {
    try {
      await lockUserMutation.mutateAsync(id.toString())
      toast.success('User locked successfully!')
    } catch (error: any) {
      console.error('Lock user failed:', error)
      toast.error(error?.response?.data?.message || 'Failed to lock user. Please try again.')
    }
  }

  const handleUnlock = async (id: number) => {
    try {
      await unlockUserMutation.mutateAsync(id.toString())
      toast.success('User unlocked successfully!')
    } catch (error: any) {
      console.error('Unlock user failed:', error)
      toast.error(error?.response?.data?.message || 'Failed to unlock user. Please try again.')
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'error'
      case 'support': return 'warning'
      case 'user': return 'primary'
      default: return 'default'
    }
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Alert severity="error">
          Failed to load users. Please try again.
        </Alert>
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Users Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add User
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(usersResponse?.data ?? []).map((user: User) => {
                  const isActive = user.isActive === true
                  return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                        {user.username || [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email}
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={(user.roleType || 'support')}
                        color={getRoleColor((user.roleType || 'support')) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={isActive ? 'active' : 'inactive'}
                        color={isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{user.createdAt}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleOpen(user)}
                        color="primary"
                        title="Edit User"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleRoleChange(user)}
                        color="secondary"
                        title="Change Role"
                      >
                        <PersonIcon />
                      </IconButton>
                      {!isActive ? (
                        <IconButton
                          size="small"
                          onClick={() => handleUnlock(user.id)}
                          color="warning"
                          title="Lock User"
                        >
                          <LockIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          size="small"
                          onClick={() => handleLock(user.id)}
                          color="success"
                          title="Unlock User"
                        >
                          <LockOpenIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                )})}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* User Form Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <UserForm
              userId={editingUser?.id}
              onSubmit={handleUserSubmit}
              onCancel={handleClose}
              submitLabel={editingUser ? 'Update' : 'Create'}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Role Change Dialog */}
      <Dialog open={!!roleChangeUser} onClose={() => setRoleChangeUser(null)} maxWidth="sm" fullWidth>
        <form onSubmit={roleForm.handleSubmit(handleRoleSubmit)}>
          <DialogTitle>
            Change Role for {roleChangeUser ? (roleChangeUser.username || [roleChangeUser.firstName, roleChangeUser.lastName].filter(Boolean).join(' ') || roleChangeUser.email) : ''}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <Controller
                name="role"
                control={roleForm.control}
                render={({ field }) => (
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Role</InputLabel>
                    <Select
                      {...field}
                      label="Role"
                      error={!!roleForm.formState.errors.role}
                    >
                      <MenuItem value="support">Support</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRoleChangeUser(null)}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={changeRoleMutation.isPending}
            >
              {changeRoleMutation.isPending ? <CircularProgress size={20} /> : 'Change Role'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

export default Users