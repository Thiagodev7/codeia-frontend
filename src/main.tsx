import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.tsx' // <--- Importar

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Envolver o App com o ThemeProvider */}
    <ThemeProvider defaultTheme="dark" storageKey="codeia-theme">
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)