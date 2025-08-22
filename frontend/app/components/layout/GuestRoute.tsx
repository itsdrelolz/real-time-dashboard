import { NavLink } from "react-router";
import { useAuthStore } from "~/store/auth.store";

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const status = useAuthStore((state) => state.status);

  if (status === "loading") {
    return <div>Loading session...</div>;
  }

  if (status === "authenticated") {
    return <NavLink to="/projects/@me" replace />;
  }

  return <>{children}</>;
}

