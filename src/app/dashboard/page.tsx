"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { DashboardStats, JobStatus } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";

const STATUS_ORDER: JobStatus[] = [
  "applied",
  "interview",
  "assessment",
  "offer",
  "rejected",
];

const STAT_COLORS: Record<JobStatus, string> = {
  applied: "border-blue-500 bg-blue-50",
  interview: "border-purple-500 bg-purple-50",
  assessment: "border-yellow-500 bg-yellow-50",
  offer: "border-green-500 bg-green-50",
  rejected: "border-red-500 bg-red-50",
};

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ data: DashboardStats }>("/api/jobs/dashboard")
      .then(({ data }) => setStats(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/*Navbar*/}
        <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">📋 Job Tracker</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/jobs"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium"
            >
              All Jobs
            </Link>
            <Link
              href="/jobs/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              + All Job
            </Link>
            <span className="text-gray-500 text-sm">Hi, {user?.username}</span>
            <button
              onClick={logout}
              className="text-gray-500 hover:text-red-600 text-sm"
            >
              Logout
            </button>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
            </div>
          ) : stats ? (
            <>
              {/* Total + Success Rate */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border-gray-100">
                  <p className="text-gray-500 text-sm">Total Applications</p>
                  <p className="text-4xl font-bold text-gray-800 mt-1">
                    {stats.successRate}%
                  </p>
                </div>
              </div>

              {/*Status Breakdown */}
              <div className="grid grid-cols-5 gap-3 mb-8">
                {STATUS_ORDER.map((status) => (
                  <div
                    key={status}
                    className={`bg-white rounded-xl p-4 border-l-4 shadow-sm ${STAT_COLORS[status]}`}
                  >
                    <p className="text-gray-500 text-xs capitalize">{status}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {stats.statusBreakdown[status]}
                    </p>
                  </div>
                ))}
              </div>

              {/* Recent Applications */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">
                    Recent Applications
                  </h3>
                  <Link
                    href="/jobs"
                    className="text-blue-600 text-sm hover:underline"
                  >
                    View all →
                  </Link>
                </div>
                <div className="divide-y divide-gray-50">
                  {stats.recentApplications.map((job) => (
                    <Link
                      key={job._id}
                      href={`/jobs/${job._id}`}
                      className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {job.position}
                        </p>
                        <p className="text-gray-500 text-sm">{job.company}</p>
                      </div>
                      <StatusBadge status={job.status as JobStatus} />
                    </Link>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Failed to load dashboard.</p>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
