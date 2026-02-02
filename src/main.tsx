import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Envolver o App com o ThemeProvider */}
    <ThemeProvider defaultTheme="dark" storageKey="codeia-theme">
      <App />
      <Toaster
        position="top-right"
        richColors
        closeButton
        expand={false}
        duration={4000}
      />
    </ThemeProvider>
  </StrictMode>,
)