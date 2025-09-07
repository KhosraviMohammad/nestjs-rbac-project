import React, { useState } from 'react'
import { Box, Typography, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent, Alert, CircularProgress } from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Lock as LockIcon, LockOpen as LockOpenIcon } from '@mui/icons-material'
import UserForm from './components/UserForm'
import { useUsers, useLockUser, useUnlockUser } from '@/hooks'
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

  // React Query hooks
  const { data: usersResponse, isLoading, error } = useUsers()
  const lockUserMutation = useLockUser()
  const unlockUserMutation = useUnlockUser()

  // Form handlers
  const handleUserSubmit = () => {
    // Form submission is now handled by UserForm component
    handleClose()
  }


  const handleOpen = (user?: User) => {
    setEditingUser(user || null)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditingUser(null)
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

    </Box>
  )
}

export default Users