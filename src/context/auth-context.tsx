"use client";

import React, { createContext, useContext, useSyncExternalStore, useCallback } from "react";
import { UserAccount } from "@/types";
import { syncAuthUser, logoutUser } from "@/services/store-sync";

interface AuthContextType {
  user: UserAccount | null;
  isAuthenticated: boolean;
  login: (identifier: string, name?: string) => Promise<boolean>;
  register: (name: string, identifier: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function subscribeAuth(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("auth_change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("auth_change", callback);
  };
}

let cachedUserRaw: string | null = null;
let cachedUser: UserAccount | null = null;

function getAuthSnapshot(): UserAccount | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("aura_user");
    if (raw) {
      if (raw !== cachedUserRaw) {
        cachedUserRaw = raw;
        cachedUser = JSON.parse(raw);
      }
      return cachedUser;
    }
    // Default to seeded VIP Patron session
    const defaultPatron: UserAccount = {
      id: "patron_farhana",
      name: "Farhana Nasrin",
      identifier: "farhana@inspire.com",
      email: "farhana@inspire.com",
      phone: "+880 1711-234567",
      isLoggedIn: true,
    };
    cachedUserRaw = JSON.stringify(defaultPatron);
    cachedUser = defaultPatron;
    localStorage.setItem("aura_user", cachedUserRaw);
    return cachedUser;
  } catch {
    return cachedUser;
  }
}

function getServerSnapshot(): null {
  return null;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getServerSnapshot);

  const login = useCallback(async (identifier: string, name?: string) => {
    const res = await syncAuthUser(identifier, name);
    return Boolean(res?.user);
  }, []);

  const register = useCallback(async (name: string, identifier: string) => {
    const res = await syncAuthUser(identifier, name);
    return Boolean(res?.user);
  }, []);

  const logout = useCallback(() => {
    logoutUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user?.isLoggedIn),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
