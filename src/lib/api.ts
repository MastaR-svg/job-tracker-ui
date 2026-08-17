// API Client — connects to your Railway backend

import axios, { AxiosError, AxiosInstance } from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://job-tracker-api-production-5674.up.railway.app";

// Create axios instance with defaults
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // sends httpOnly refresh token cookie automatically
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // If 401 and not already retrying — try to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          `${BASE_URL}/api/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const newToken = data.data.token;
        localStorage.setItem("accessToken", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest); // retry the original request
      } catch {
        // Refresh failed — clear token and redirect to login
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
