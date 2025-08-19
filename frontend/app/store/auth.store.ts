import { create } from 'zustand'
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '~/lib/supabase';

interface AuthState {
    session: Session | null; 
    profile: User | null;
    status: 'loading' | 'authenticated' | 'unauthenticated'
}

type AuthActions = { 
    login: (session: Session, profile: User) => void; 
    logout: () => void;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({ 

    session: null, 
    profile: null, 
    status: 'loading',


    login: (session, profile) => {
    localStorage.setItem('userSession', JSON.stringify(session)); 
    set({ session, profile, status: 'authenticated' });
    }, 

    logout: () => {
    localStorage.removeItem('userSession');
    set({ session: null, profile: null, status: 'unauthenticated' }); 
    }, 

   checkAuth: async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      set({ session: null, profile: null, status: 'unauthenticated' });
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });

      if (response.ok) {
        const profile = await response.json();
        useAuthStore.getState().login(session, profile);
      } else {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.error("Auth check failed", e);
        await supabase.auth.signOut();
    }
  },
}));

supabase.auth.onAuthStateChange((event, session) => {
  const { checkAuth, logout } = useAuthStore.getState();

  if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    checkAuth();
  } else if (event === 'SIGNED_OUT') {
    logout();
  }
}); 
