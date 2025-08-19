import { Navigate } from "react-router-dom";
import { useAuthStore } from "~/store/auth.store";

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const status = useAuthStore((state) => state.status);

  if (status === "loading") {
    return <div>Loading session...</div>;
  }

  if (status === "authenticated") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

