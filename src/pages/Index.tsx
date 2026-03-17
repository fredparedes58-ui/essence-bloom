import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import AuthPage from '@/pages/AuthPage';
import AdminDashboard from '@/pages/AdminDashboard';
import UserHomePage from '@/pages/UserHomePage';
import UserRitualPage from '@/pages/UserRitualPage';
import UserComunidadPage from '@/pages/UserComunidadPage';
import UserPerfilPage from '@/pages/UserPerfilPage';
import BottomNav from '@/components/BottomNav';

export default function Index() {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-ritual mx-auto mb-4 animate-pulse-soft" />
          <p className="font-body text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  // Admin view
  if (isAdmin && (location.pathname.startsWith('/admin') || location.pathname === '/')) {
    return <AdminDashboard />;
  }

  // User view
  const path = location.pathname;

  return (
    <div className="max-w-lg mx-auto relative">
      {path === '/' && <UserHomePage />}
      {path === '/ritual' && <UserRitualPage />}
      {path === '/comunidad' && <UserComunidadPage />}
      {path === '/perfil' && <UserPerfilPage />}
      <BottomNav />
    </div>
  );
}
