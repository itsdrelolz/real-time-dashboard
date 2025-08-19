import { useEffect } from "react";
import { useAuthStore } from "~/store/auth.store";

export function Dashboard() {
  const { profile, status, logout } = useAuthStore((state) => ({
    profile: state.profile,
    status: state.status,
    logout: state.logout,
  }));

  useEffect(() => {
  }, [status, logout]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {profile ? (
        <div>
          <p>Welcome {profile.email}</p>
          <button
            onClick={logout}
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}
