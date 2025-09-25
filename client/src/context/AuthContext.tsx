import { createStore } from "solid-js/store";
import { type AuthChangeEvent, type Session, type User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient"; 
import { createContext, useContext, onMount, type Component, type JSX } from "solid-js";
import { type Profile } from "../types";


type AuthState = {
    user: User | null;
    userProfile: Profile | null;    
    session: Session | null;
    isLoading: boolean;
    error: string | null;
};

type AuthContextValue = [
    state: AuthState,
    actions: {
        login: (email: string, password: string) => Promise<void>;
        logout: () => Promise<void>;
        register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
    }
];

const AuthContext = createContext<AuthContextValue>();

export const AuthProvider: Component<{ children: JSX.Element }> = (props) => {
    const [state, setState] = createStore<AuthState>({
        user: null,
        userProfile: null,
        session: null,
        isLoading: true, 
        error: null,
    });

    
    const syncProfile = async (user: User) => {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error("Error fetching profile:", error.message);
           
            return;
        }

        setState({ user, userProfile: profile });
    };

    
    onMount(() => {
       
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (session) {
                setState({ session });
                await syncProfile(session.user);
            }
            setState('isLoading', false);
        });

        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event: AuthChangeEvent, session: Session | null) => {
                if (event === "SIGNED_IN" && session) {
                    setState({ session });
                    await syncProfile(session.user);
                } else if (event === "SIGNED_OUT") {
                    setState({ user: null, userProfile: null, session: null });
                }
            }
        );
    });

    
    const actions = {
        async login(email: string, password: string) {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                setState({ error: error.message });
                throw error;
            }
           
        },

        async logout() {
            const { error } = await supabase.auth.signOut();
            if (error) {
                setState({ error: error.message });
                throw error;
            }
           
        },

        async register(firstName: string, lastName: string, email: string, password: string) {
           
            const { data, error: registerError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (registerError) {
                setState({ error: registerError.message });
                throw registerError;
            }
            if (!data.user) throw new Error("Sign up successful, but no user data returned.");

            
            const { error: profileError } = await supabase.from('profiles').insert({
                id: data.user.id, 
                email: email,
                firstName: firstName,
                lastName: lastName,
                displayName: `${firstName} ${lastName}`,
            });

            if (profileError) {
                
                setState({ error: profileError.message });
                throw profileError;
            }
        }
    };

    const store: AuthContextValue = [state, actions];

    
    return (
        <AuthContext.Provider value={store}>
            {props.children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};