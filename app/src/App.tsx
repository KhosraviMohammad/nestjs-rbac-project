import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Users from './pages/Users/Users'

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
