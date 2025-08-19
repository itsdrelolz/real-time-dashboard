import { create } from "zustand";
import { supabase } from "~/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";

interface AuthState {
  session: Session | null;
  profile: User | null;
  status: "loading" | "authenticated" | "unauthenticated";
  login: (session: Session, profile: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  profile: null,
  status: "loading",

  login: (session, profile) => {
    set({ session, profile, status: "authenticated" });
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ session: null, profile: null, status: "unauthenticated" });
  },
}));

supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === "SIGNED_IN" && session) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (response.ok) {
        const profile = await response.json();
        useAuthStore.setState({ session, profile, status: "authenticated" });
      } else {
        await supabase.auth.signOut();
        useAuthStore.setState({ session: null, profile: null, status: "unauthenticated" });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      await supabase.auth.signOut();
      useAuthStore.setState({ session: null, profile: null, status: "unauthenticated" });
    }
  } else if (event === "SIGNED_OUT") {
    useAuthStore.setState({ session: null, profile: null, status: "unauthenticated" });
  } else if (event === "INITIAL_SESSION" && !session) {
    useAuthStore.setState({ session: null, profile: null, status: "unauthenticated" });
  }
});
