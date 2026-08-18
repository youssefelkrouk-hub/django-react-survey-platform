import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import { LoginPage } from './pages/LoginPage';
import { DashboardEnqueteurPage } from './pages/DashboardEnqueteurPage';
import { DashboardAdminPage } from './pages/DashboardAdminPage';
import { NouvelleCollectePage } from './pages/NouvelleCollectePage';
import { MesCollectesPage } from './pages/MesCollectesPage';
import { GestionEnqueteursPage } from './pages/GestionEnqueteursPage';

const RootRedirect = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/enqueteur/dashboard" replace />;
};

export function App() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <main className="container py-4 flex-grow-1">
        {/* La clé sur le pathname force un remontage à chaque navigation,
            ce qui redéclenche l'animation CSS .page-transition (fondu + léger glissement). */}
        <div key={location.pathname} className="page-transition">
          <Routes location={location}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<RootRedirect />} />

            {/* Routes Enquêteur */}
            <Route
              path="/enqueteur/dashboard"
              element={
                <ProtectedRoute requiredRole="enqueteur">
                  <DashboardEnqueteurPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/enqueteur/nouvelle-collecte"
              element={
                <ProtectedRoute requiredRole="enqueteur">
                  <NouvelleCollectePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/enqueteur/mes-collectes"
              element={
                <ProtectedRoute requiredRole="enqueteur">
                  <MesCollectesPage />
                </ProtectedRoute>
              }
            />

            {/* Routes Admin */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardAdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/enqueteurs"
              element={
                <ProtectedRoute requiredRole="admin">
                  <GestionEnqueteursPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default App;
