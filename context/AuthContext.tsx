import { createContext, useContext, useState, ReactNode } from 'react';

/**
 * A minimal AuthContext stub.
 *
 * This simplified context always returns `null` for the user and sets
 * `loading` to false.  In a production build you would integrate
 * NextAuth or another auth provider here and expose the current user
 * and loading state.  This stub allows pages like Design and Evolve
 * to render without throwing errors while still demonstrating how
 * entitlements might be checked.
 */
interface AuthContextType {
  user: any;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: false });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user] = useState<any>(null);
  const [loading] = useState(false);
  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
