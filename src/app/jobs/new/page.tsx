"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import { JobStatus } from "@/types";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUSES: JobStatus[] = [
  "applied",
  "interview",
  "assessment",
  "offer",
  "rejected",
];

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    company: "",
    position: "",
    status: "applied" as JobStatus,
    appliedDate: new Date().toISOString().split("T")[0],
    salary: "",
    location: "",
    jobUrl: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/api/jobs", {
        ...form,
        salary: form.salary ? Number(form.salary) : undefined,
      });
      router.push("/jobs");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message ?? "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/*Navbar*/}
        <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-xl font-bold text-blue-600">
            📋 Job Tracker
          </Link>
          <Link
            href="/jobs"
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Back to Jobs
          </Link>
        </nav>

        <main className="max-w-2xl mx-auto p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Add New Application
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5"
          >
            {/*Company + Position*/}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Google"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position <span className="text-red-500">*</span>
                </label>
                <input
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Backend Engineer"
                  required
                />
              </div>
            </div>

            {/*Status + Applied Date*/}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="capitaliza">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Applied Date
                </label>
                <input
                  type="date"
                  name="appliedDate"
                  value={form.appliedDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {/*Salary + Location*/}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary (optional)
                </label>
                <input
                  type="number"
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="120000"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location (optional)
                </label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Remote / New York"
                />
              </div>
            </div>

            {/* Job URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job URL (optional)
              </label>
              <input
                type="url"
                name="jobUrl"
                value={form.jobUrl}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://careers.google.com/jobs/123"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optional)
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Applied via LinkedIn, referral from John..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
              >
                {loading ? "Saving..." : "Save Application"}
              </button>
              <Link
                href="/jobs"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}
