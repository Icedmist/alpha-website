import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  // baseURL can be omitted to default to window.location.origin
  // but we explicitly pass it for clarity and proxy support
  baseURL: typeof window !== 'undefined' ? window.location.origin : undefined,
});

export const { signIn, signUp, signOut, useSession } = authClient;
