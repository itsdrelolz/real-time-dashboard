import { useState } from "react";
// No longer need useNavigate or useEffect here!
import { useAuthStore } from "~/store/auth.store";
import { supabase } from "~/lib/supabase";

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuthStore((state) => ({
    login: state.login,
  }));

  // The problematic useEffect has been removed.

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const credentials = Object.fromEntries(formData);

    if (credentials.password !== credentials.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed. Please try again.");
        return;
      }

      const { session, profile } = await response.json();

      if (session) {
        await supabase.auth.setSession(session);
        login(session, profile);
        // No navigate() call needed.
      } else {
        setError("Registration response was missing session data.");
      }
    } catch (err) {
      setError("Network error. Could not connect to the server.");
    }
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col p-6 space-y-1">
        <h3 className="font-semibold tracking-tight text-2xl">
          Create an account
        </h3>
        <p className="text-sm text-muted-foreground">
          Enter your email below to create your account
        </p>
      </div>
      <div className="p-6 pt-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form inputs remain the same */}
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none"
              htmlFor="fullName"
            >
              Full Name
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              id="fullName"
              name="fullName"
              placeholder="John Doe"
              required
              type="text"
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              id="email"
              name="email"
              placeholder="m@example.com"
              required
              type="email"
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              id="password"
              name="password"
              required
              type="password"
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              id="confirmPassword"
              name="confirmPassword"
              required
              type="password"
            />
          </div>

          {error && <p className="text-sm font-medium text-destructive">{error}</p>}

          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 w-full bg-primary text-primary-foreground hover:bg-primary/90"
            type="submit"
          >
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}

