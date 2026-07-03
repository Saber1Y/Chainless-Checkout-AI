"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getWalletAddress, isLoggedIn, logout as magicLogout } from "@/lib/magic";

interface AuthContextType {
  address: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  address: null,
  isAuthenticated: false,
  isLoading: true,
  refresh: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    try {
      const loggedIn = await isLoggedIn();
      if (loggedIn) {
        const addr = await getWalletAddress();
        setAddress(addr);
        setIsAuthenticated(true);
      } else {
        setAddress(null);
        setIsAuthenticated(false);
      }
    } catch {
      setAddress(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await magicLogout();
    setAddress(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider
      value={{ address, isAuthenticated, isLoading, refresh, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
