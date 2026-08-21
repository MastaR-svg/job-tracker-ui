import { ReactNode } from "react";

export type JobStatus =
  | "applied"
  | "interview"
  | "assessment"
  | "offer"
  | "rejected";

export interface User {
  _id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  _id: string;
  userId: string;
  company: string;
  position: string;
  status: string;
  appliedDate: string;
  salary?: number;
  location?: string;
  notes?: string;
  jobUrl?: string;
  resumeUrl?: string;
  interviewDate?: string;
  createdAt: string;
  updated: string;
}

export interface DashboardStats {
  totalApplications: ReactNode;
  totalApplication: number;
  statusBreakdown: Record<JobStatus, number>;
  recentApplications: JobApplication[];
  successRate: number;
}

export interface PaginationResponse<T> {
  success: boolean;
  data: T[];
  message: string;
  timestamp: string;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: string;
}
