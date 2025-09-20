import { createContext, useState, useEffect, ReactNode } from "react";
import { api } from "../services/api";
import type { User, AuthContextType } from "./authTypes";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Récupère l'utilisateur courant depuis le backend
  const fetchCurrentUser = async () => {
    try {
      const response = await api.get("/auth/me"); // ✅ chemin corrigé
      setUser(response.data.user);
    } catch {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password }); // ✅ chemin corrigé
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error("Login failed");
      throw error;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
