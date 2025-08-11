import type { Session as SupabaseSession } from '@supabase/supabase-js'; 
import type { User as AppUser } from '@prisma/client'; 



export type User = AppUser; 

export type Session = SupabaseSession; 


export type AuthResponse = { 
    user: User; 
    session: Session;
}; 

export type SignupParams = {
  email: string;
  password: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
};

export type LoginParams = {
  email:string;
  password: string;
};


