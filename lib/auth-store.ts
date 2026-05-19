"use client";

import { create } from "zustand";
import { api } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  agency?: string;
  profilePicture?: string;
  subscription?: {
    plan: string;
    status: "active" | "inactive" | "trial" | "expired";
    startDate?: string;
    expiryDate?: string;
    customerId?: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (email: string, password: string, name: string, agency?: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  loading: false,
  initialized: false,

  login: async (email, password) => {
    set({ loading: true });
    const res = await api.post<{ token: string; user: User }>("/api/auth/login", {
      email,
      password,
    });
    if (res.ok && res.data) {
      localStorage.setItem("token", res.data.token);
      set({ user: res.data.user, token: res.data.token, loading: false });
      return { ok: true };
    }
    set({ loading: false });
    return { ok: false, error: res.error };
  },

  signup: async (email, password, name, agency) => {
    set({ loading: true });
    const res = await api.post<{ token: string; user: User }>("/api/auth/register", {
      email,
      password,
      name,
      agency,
    });
    if (res.ok && res.data) {
      localStorage.setItem("token", res.data.token);
      set({ user: res.data.user, token: res.data.token, loading: false });
      return { ok: true };
    }
    set({ loading: false });
    return { ok: false, error: res.error };
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  setUser: (user) => set({ user }),

  fetchMe: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ initialized: true });
      return;
    }
    set({ token, loading: true });
    const res = await api.get<User>("/api/auth/me");
    if (res.ok && res.data) {
      set({ user: res.data, loading: false, initialized: true });
    } else {
      localStorage.removeItem("token");
      set({ user: null, token: null, loading: false, initialized: true });
    }
  },
}));
