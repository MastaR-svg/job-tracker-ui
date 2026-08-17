"use client";

import api from "@/lib/api";
import { ApiResponse, AuthResponse, User } from "@/types";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      api
        .get<{ data: User }>("/api/auth/me")
        .then(({ data }) => setUser(data.data))
        .catch(() => localStorage.removeItem("accessToken"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      "/api/auth/login",
      { email, password },
    );
    localStorage.setItem("accessToken", data.data.token);
    setUser(data.data.user);
    router.push("/dashbaord");
  };

  const register = async (
    email: string,
    username: string,
    password: string,
  ) => {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      "/api/auth/register",
      { email, username, password },
    );
    localStorage.setItem("accessToken", data.data.token);
    setUser(data.data.user);
    router.push("/dashboard");
  };

  const logout = async () => {
    await api.post("/api/auth/logout");
    localStorage.removeItem("accessToken");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used with AuthProvider");
  return context;
}
