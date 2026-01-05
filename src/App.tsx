import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/layout/PrivateRoute';

// Páginas Existentes
import { LoginPage } from './features/auth/LoginPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { MonitoringPage } from './features/monitor/MonitoringPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { BusinessPage } from './features/business/BusinessPage';
import AgentsPage from './features/agents/AgentsPage'; // Verifique se o export é default ou named
import ChatPage from './features/chat/ChatPage'; 

// ✅ IMPORTAÇÃO NOVA (A página que criamos)
import { AppointmentsPage } from './features/appointments/AppointmentsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* --- ROTAS PROTEGIDAS --- */}
          
          <Route path="/" element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } />

          <Route path="/monitor" element={
            <PrivateRoute>
              <MonitoringPage />
            </PrivateRoute>
          } />

          <Route path="/business" element={
            <PrivateRoute>
              <BusinessPage />
            </PrivateRoute>
          } />

          {/* ✅ ROTA ALINHADA COM O SIDEBAR (/calendar) */}
          <Route path="/calendar" element={
            <PrivateRoute>
              <AppointmentsPage />
            </PrivateRoute>
          } />

          <Route path="/agents" element={
            <PrivateRoute>
              <AgentsPage />
            </PrivateRoute>
          } />

          <Route path="/chat" element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          } />

          <Route path="/settings" element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;