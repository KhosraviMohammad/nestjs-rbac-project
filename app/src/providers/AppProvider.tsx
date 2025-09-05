import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import QueryProvider from './QueryProvider'
import ThemeProvider from './ThemeProvider'

interface AppProviderProps {
  children: React.ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <QueryProvider>
      <BrowserRouter>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </BrowserRouter>
    </QueryProvider>
  )
}

export default AppProvider
