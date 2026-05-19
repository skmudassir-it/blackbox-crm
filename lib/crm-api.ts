"use client";

import { api } from "@/lib/api";

// --- CRM API wrapper (same as api but clearer naming) ---
export const crmApi = {
  get: <T = any>(endpoint: string) => api.get<T>(endpoint),
  post: <T = any>(endpoint: string, body: any) => api.post<T>(endpoint, body),
  put: <T = any>(endpoint: string, body: any) => api.put<T>(endpoint, body),
  delete: <T = any>(endpoint: string) => api.delete<T>(endpoint),
};

// --- Types matching backend models ---
export interface Client {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  policyType: "life" | "auto" | "home" | "health" | "commercial" | "other";
  policyNumber?: string;
  carrier?: string;
  status: "active" | "inactive" | "prospect";
  notes?: string;
  tags: string[];
  agentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "completed";
  category?: string;
  agentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrmDocument {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  agentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  _id: string;
  title: string;
  clientId?: string | Client;
  clientName?: string;
  date: string;
  startTime: string;
  endTime: string;
  type: "call" | "meeting" | "followup" | "renewal";
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  agentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalClients: number;
  activeClients: number;
  pendingTodos: number;
  upcomingAppointments: number;
  recentDocuments: CrmDocument[];
  recentClients: Client[];
  upcomingAppointmentsList: Appointment[];
}
