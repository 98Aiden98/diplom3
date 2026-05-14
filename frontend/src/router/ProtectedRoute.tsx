import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function ProtectedRoute() {
  const location = useLocation();
  const { token, initialized } = useAuthStore();

  if (!initialized && token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="surface-card rounded-[2rem] px-8 py-10 text-center">
          <div className="mx-auto mb-3 h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
          <div className="font-sans text-lg font-semibold text-slate-900">Загрузка профиля</div>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
