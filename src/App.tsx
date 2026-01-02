import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/layout/PrivateRoute';
import { LoginPage } from './features/auth/LoginPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { MonitoringPage } from './features/monitor/MonitoringPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { BusinessPage } from './features/business/BusinessPage'; 
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

          <Route path="/settings" element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;