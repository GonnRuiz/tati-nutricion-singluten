import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { DashboardLayout } from '@/components/DashboardLayout';
import { LandingPage } from '@/pages/LandingPage';
import { BlogPage } from '@/pages/BlogPage';
import { ArticlePage } from '@/pages/ArticlePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { DatosPage } from '@/pages/DatosPage';
import { PlanPage } from '@/pages/PlanPage';
import { ReservasPage } from '@/pages/ReservasPage';
import { AdminPage } from '@/pages/AdminPage';

function PrivateRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout><LandingPage /></Layout>} />
      <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
      <Route path="/blog/:slug" element={<Layout><ArticlePage /></Layout>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      {/* Patient Dashboard Routes */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <DashboardLayout><DashboardPage /></DashboardLayout>
        </PrivateRoute>
      } />
      <Route path="/dashboard/datos" element={
        <PrivateRoute>
          <DashboardLayout><DatosPage /></DashboardLayout>
        </PrivateRoute>
      } />
      <Route path="/dashboard/plan" element={
        <PrivateRoute>
          <DashboardLayout><PlanPage /></DashboardLayout>
        </PrivateRoute>
      } />
      <Route path="/dashboard/reservas" element={
        <PrivateRoute>
          <DashboardLayout><ReservasPage /></DashboardLayout>
        </PrivateRoute>
      } />

      {/* Admin Route */}
      <Route path="/admin" element={
        <PrivateRoute requireAdmin>
          <AdminPage />
        </PrivateRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
