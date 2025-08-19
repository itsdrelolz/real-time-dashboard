import { useEffect } from "react";
import { useAuthStore } from "~/store/auth.store";

export function Dashboard() {

const profile = useAuthStore((state) => state.profile);
const status = useAuthStore((state) => state.status);
const logout = useAuthStore((state) => state.logout);

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
          <p>Welcome {profile.displayName}</p>
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
