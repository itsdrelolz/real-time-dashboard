import type { Session as SupabaseSession } from "@supabase/supabase-js";
import type { Profile } from "./profile.types"; 


export type Session = SupabaseSession;

export type AuthResponse = {
  profile: Profile; 
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
  email: string;
  password: string;
};
