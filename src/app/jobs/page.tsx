"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import StatusBadge from "@/components/StatusBadge";
import api from "@/lib/api";
import { JobApplication, JobStatus, PaginationResponse } from "@/types";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const STATUSES: JobStatus[] = [
  "applied",
  "interview",
  "assessment",
  "offer",
  "rejected",
];

export default function JobPage() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        sortBy,
        sortOrder,
        ...(search && { search }),
        ...(search && { search }),
      });

      const { data } = await api.get<PaginationResponse<JobApplication>>(
        `/api/jobs?${params}`,
      );
      setJobs(data.data);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, status, sortBy, sortOrder]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-1 font-bold text-blue-600">
            📋 Job Tracker
          </Link>
          <Link
            href="/jobs/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            + Add Job
          </Link>
        </nav>

        <main className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              All Applications
              <span className="text-gray-400 text-lg font-normal ml-2">
                ({total})
              </span>
            </h2>
          </div>

          {/*Filters*/}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search company, position..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2-blue-500"
            />

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s}
                </option>
              ))}
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortBy(field);
                setSortOrder(order);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="company-asc">Company A→Z</option>
              <option value="appliedDate-desc">Applied Date</option>
              <option value="salary-desc">Highest Salary</option>
            </select>
          </div>

          {/* Job List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border-gray-100">
              <p className="text-gray-400 text-lg">No jobs found</p>
              <Link
                href="/jobs/new"
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                Add your first application →
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50">
              {jobs.map((job) => (
                <Link
                  key={job._id}
                  href={`/jobs/${job._id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-gray-800">
                        {job.position}
                      </p>
                      <StatusBadge status={job.status as JobStatus} />
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-gray-500 text-sm">{job.company}</p>
                      {job.location && (
                        <p className="text-gray-400 text-sm">
                          📍{job.location}
                        </p>
                      )}
                      {job.salary && (
                        <p className="text-gray-400 text-sm">
                          💰 ${job.salary.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {new Date(job.appliedDate).toDateString()}
                  </p>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                ← Previous
              </button>
              <span className="text-gray-500 text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text.sm disabled:opacity-50 hover:bg-gray-50"
              >
                Next →
              </button>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
