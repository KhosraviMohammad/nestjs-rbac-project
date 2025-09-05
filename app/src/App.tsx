import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import Layout from './components/Layout'
import Login from './pages/Login'
import Users from './pages/Users'

function App() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </Layout>
    </Box>
  )
}

export default App
