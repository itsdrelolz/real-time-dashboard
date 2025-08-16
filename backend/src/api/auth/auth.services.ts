import prisma from "../../utils/prismaClient";
import { supabase } from "../supabaseServer";
import type {
  Profile,
  SignupParams,
  LoginParams,
  AuthResponse,
} from "@/types/auth.types";

// AUTH SERVICES

export async function signupUser(params: SignupParams): Promise<AuthResponse> {
  const { email, password, displayName, firstName, lastName } = params;

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { displayName, firstName, lastName },
    },
  });

  if (authError) throw authError;
  if (!authData.user || !authData.session) {
    throw new Error("Signup incomplete: No user or session returned.");
  }

  const profile = await prisma.profile.findUniqueOrThrow({
    where: { id: authData.user.id },
  });

  return { profile, session: authData.session };
}
export async function signinUser(params: LoginParams): Promise<AuthResponse> {
  const { email, password } = params;

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (authError) throw authError;
  if (!authData.user || !authData.session) {
    throw new Error("Sign-in incomplete: No user or session returned.");
  }

  const profile = await prisma.profile.findUnique({
    where: { id: authData.user.id },
  });

  if (!profile) {
    throw new Error("User profile not found in database.");
  }

  return { profile, session: authData.session };
}

export async function signoutUser(jwt: string): Promise<void> {
  const { error } = await supabase.auth.admin.signOut(jwt);
  if (error) throw error;
}

export async function getUserFromToken(jwt: string): Promise<Profile | null> {
  const {
    data: { user: authUser },
    error,
  } = await supabase.auth.getUser(jwt);

  if (error || !authUser) {
    return null;
  }

  const profile = await prisma.profile.findUnique({
    where: { id: authUser.id },
  });

  return profile;
}
