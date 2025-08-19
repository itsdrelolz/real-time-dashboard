import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "~/store/auth.store";

export function ProtectedRoute() {
  const status = useAuthStore((state) => state.status);

  if (status === 'loading') {
    return <div>Loading Application...</div>;
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
