import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'
import { queryClient } from './lib/queryClient'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Envolver o App com o ThemeProvider */}
    <ThemeProvider defaultTheme="dark" storageKey="codeia-theme">
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          position="top-right"
          richColors
          closeButton
          expand={false}
          duration={4000}
        />
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)