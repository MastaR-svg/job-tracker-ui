"use client";

import { useAuth } from "@/context/AuthContext";
import { AxiosError } from "axios";
import Link from "next/link";
import { useState } from "react";

interface ValidationError {
  field: string;
  message: string;
}

export default function RegisterPage() {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ValidationError[]>([]);
  const [loading, setLoading] = useState(false);

  const getFieldError = (field: string) =>
    fieldErrors.find((e) => e.field === field)?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors([]);
    setLoading(true);

    try {
      await register(email, username, password);
    } catch (err) {
      const axiosError = err as AxiosError<{
        message: string;
        errors?: ValidationError[];
      }>;
      const data = axiosError.response?.data;
      if (data?.errors) {
        setFieldErrors(data.errors);
      } else {
        setError(data?.message ?? "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-8">
        {/*Header*/}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">📋 Job Tracker</h1>
          <p className="text-gray-500 mt-2">Create your account</p>
        </div>

        {/*Global error*/}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/*Form*/}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getFieldError("email") ? "border-red-400" : "border-gray-300"
              }`}
              placeholder="your@example.com"
              required
            />
            {getFieldError("") && (
              <p className="text-red-500 text-xs mt-1">
                {getFieldError("email")}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getFieldError("username") ? "border-red-400" : "border-gray-300"
              }`}
              placeholder="johndoe"
              required
            />
            {getFieldError("username") && (
              <p className="text-red-500 text-xs mt-1">
                {getFieldError("username")}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getFieldError("password") ? "border-red-400" : "border-gray-300"
              }`}
              placeholder="Min 8 characters, 1 uppercase, 1 number"
              required
            />
            {getFieldError("password") && (
              <p className="text-red-500 text-xs mt-1">
                {getFieldError("password")}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Alread have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
