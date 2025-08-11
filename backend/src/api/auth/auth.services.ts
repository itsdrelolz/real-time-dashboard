import prisma from '../../utils/prismaClient';
import { supabase } from '../supabaseServer';
import type { User, SignupParams, LoginParams, AuthResponse } from '@/types/auth.types';

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
    throw new Error('Signup incomplete: No user or session returned.');
  }

  try {
    const user = await prisma.user.create({
      data: {
        id: authData.user.id,
        email: authData.user.email!,
        displayName,
        firstName,
        lastName,
      },
    });

    return { user, session: authData.session };
  } catch (prismaError: unknown) {
    await supabase.auth.admin.deleteUser(authData.user.id);

    if (prismaError instanceof Error) {
      throw new Error(`Failed to create user profile: ${prismaError.message}`);
    }
    
    throw new Error('Failed to create user profile due to an unknown error.');
  }
}

export async function signinUser(params: LoginParams): Promise<AuthResponse> {
  const { email, password } = params;

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) throw authError;
  if (!authData.user || !authData.session) {
    throw new Error('Sign-in failed: No user or session returned.');
  }

  const user = await prisma.user.findUnique({
    where: { id: authData.user.id },
  });

  if (!user) {
    throw new Error('User profile not found in database.');
  }

  return { user, session: authData.session };
}

export async function signoutUser(jwt: string): Promise<void> {
  const { error } = await supabase.auth.admin.signOut(jwt);
  if (error) throw error;
}


export async function getUserFromToken(jwt: string): Promise<User | null> {
  const { data: { user: authUser }, error } = await supabase.auth.getUser(jwt);

  if (error || !authUser) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
  });

  return user;
}

