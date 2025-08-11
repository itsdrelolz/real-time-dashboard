

type SupabaseAuthError = { 
    status: number, 
    message: string, 
}; 

export function isSupabaseAuthError(error: unknown): error is SupabaseAuthError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'message' in error
  );
}
