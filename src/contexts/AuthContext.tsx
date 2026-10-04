import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  type User,
  type Role,
  type Permission,
  getSession,
  setSession,
  clearSession,
  login as authLogin,
  hasPermission,
} from "@/lib/auth";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
  ) => { success: true } | { success: false; error: string };
  logout: () => void;
  can: (permission: Permission) => boolean;
  is: (role: Role) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    setUser(session);
    setIsLoading(false);
  }, []);

  function login(
    email: string,
    password: string,
  ): { success: true } | { success: false; error: string } {
    const result = authLogin(email, password);
    if (result.success) {
      setSession(result.user);
      setUser(result.user);
      return { success: true };
    }
    return result;
  }

  function logout() {
    clearSession();
    setUser(null);
  }

  function can(permission: Permission) {
    if (!user) return false;
    return hasPermission(user.role, permission);
  }

  function is(role: Role) {
    return user?.role === role;
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, can, is }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
