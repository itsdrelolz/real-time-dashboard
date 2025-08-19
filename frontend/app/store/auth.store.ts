import { create } from 'zustand'
import type { Session, User } from '@supabase/supabase-js';

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

    checkAuth: async() => { 
    try { 
	    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, { 
	    method: 'GET', 
	    });
    
	    if (response.ok) { 
    
		const { user } = await response.json(); 

		set({profile: user, session: user.session, status: 'authenticated' });	
    } else { 
    set({ status: 'unauthenticated'}); 
    }
    } catch (error) { 
	    set({ session: null, profile: null, status: 'unauthenticated' });
	}
	},
	}));

