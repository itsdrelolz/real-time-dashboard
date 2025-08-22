import { NavLink } from "react-router";
import { useAuthStore } from "~/store/auth.store";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const status = useAuthStore((state) => state.status);

  if (status === "loading") {
    return <div>Loading session...</div>;
  }

  if (status === "unauthenticated") {
    return <NavLink to="/login" replace />;
  }

  return <>{children}</>;
}

