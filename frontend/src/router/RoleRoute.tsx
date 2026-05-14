import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { Role } from '../types/common';

interface RoleRouteProps {
  roles: Role[];
}

export function RoleRoute({ roles }: RoleRouteProps) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
