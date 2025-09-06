import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Users from './pages/Users'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Layout>
  )
}

export default App
