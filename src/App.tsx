import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/layout/PrivateRoute';
import { LoginPage } from './features/auth/LoginPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { MonitoringPage } from './features/monitor/MonitoringPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { BusinessPage } from './features/business/BusinessPage';
import AgentsPage from './features/agents/AgentsPage';
// [1] IMPORTAR O NOVO CHAT
import ChatPage from './features/chat/ChatPage'; 

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Rotas Protegidas */}
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

          <Route path="/agents" element={
            <PrivateRoute>
              <AgentsPage />
            </PrivateRoute>
          } />

          {/* [2] NOVA ROTA */}
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

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;