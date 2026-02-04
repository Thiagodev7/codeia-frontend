import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PrivateRoute } from './components/layout/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

// Páginas Existentes
import AgentsPage from './features/agents/AgentsPage'; // Verifique se o export é default ou named
import { LoginPage } from './features/auth/LoginPage';
import { BusinessPage } from './features/business/BusinessPage';
import ChatPage from './features/chat/ChatPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { MonitoringPage } from './features/monitor/MonitoringPage';
import { ServicesPage } from './features/services/ServicesPage'; // ✅ Nova Página
import { SettingsPage } from './features/settings/SettingsPage';


// ✅ IMPORTAÇÃO NOVA (A página que criamos)
import { AppointmentsPage } from './features/appointments/AppointmentsPage';
import { ChannelsPage } from './features/channels/ChannelsPage';
import { OnboardingPage } from './features/onboarding/OnboardingPage';

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
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

            {/* ✅ ROTA NOVA DE SERVIÇOS */}
            <Route path="/services" element={
              <PrivateRoute>
                <ServicesPage />
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

            {/* ✅ NOVA TELA UNIFICADA */}
            <Route path="/channels" element={
              <PrivateRoute>
                <ChannelsPage />
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

            {/* ✅ Route Onboarding */}
            <Route path="/setup" element={
              <PrivateRoute>
                <OnboardingPage />
              </PrivateRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;