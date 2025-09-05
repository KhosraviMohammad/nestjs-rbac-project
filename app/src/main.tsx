import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProvider } from './providers'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
)
