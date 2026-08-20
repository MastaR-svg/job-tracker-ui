"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import StatusBadge from "@/components/StatusBadge";
import api from "@/lib/api";
import { JobApplication, JobStatus } from "@/types";
import { AxiosError } from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const STATUSES: JobStatus[] = [
  "applied",
  "interview",
  "assessment",
  "offer",
  "rejected",
];

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [job, setJob] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [uploadingResume, setUploadingResume] = useState(false);

  const [form, setForm] = useState({
    company: "",
    position: "",
    status: "applied" as JobStatus,
    appliedDate: "",
    salary: "",
    location: "",
    jobUrl: "",
    notes: "",
  });

  useEffect(() => {
    api
      .get<{ data: JobApplication }>(`/api/jobs/${id}`)
      .then(({ data }) => {
        setJob(data.data);
        setForm({
          company: data.data.company,
          position: data.data.position,
          status: data.data.status as JobStatus,
          appliedDate: data.data.appliedDate,
          salary: data.data.salary?.toString() ?? "",
          location: data.data.location ?? "",
          jobUrl: data.data.jobUrl ?? "",
          notes: data.data.notes ?? "",
        });
      })
      .catch(() => setError("Job not found"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const { data } = await api.patch<{ data: JobApplication }>(
        `/api/jobs/${id}`,
        {
          ...form,
          salary: form.salary ? Number(form.salary) : undefined,
        },
      );
      setJob(data.data);
      setEditing(false);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this application? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await api.delete(`/api/jobs/${id}`);
      router.push("/jobs");
    } catch {
      setError("Failed to delete");
      setDeleting(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);
    setUploadingResume(true);

    try {
      const { data } = await api.post<{ data: JobApplication }>(
        `/api/jobs/${id}/resume`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      setJob(data.data);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message ?? "Upload failed");
    } finally {
      setUploadingResume(false);
      e.target.value = "";
    }
  };

  const handleResumeDelete = async () => {
    if (!confirm("Remove this resume")) return;
    try {
      const { data } = await api.delete<{ data: JobApplication }>(
        `/api/jobs/${id}/resume`,
      );
      setJob(data.data);
    } catch {
      setError("Failed to remove resume");
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      </ProtectedRoute>
    );
  }

  if (!job) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-lg">Job not found</p>
            <Link
              href="/jobs"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              ← Back to jobs
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <Link href="" className="text-xl font-bold text-blue-600">
            📋 Job Tracker
          </Link>
          <Link href="" className="text-gray-500 hover:text-gray-700 text-sm">
            ← Back to Jobs
          </Link>
        </nav>

        <main className="max-w-2xl mx-auto p-6">
          {/* Header */}
          <div>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {job.position}
              </h2>
              <p className="text-gray-500">{job.company}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={job.status as JobStatus} />
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Edit
                </button>
              )}
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-1 text-sm bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Detail / Edit Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5 mb-6">
            {editing ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <input
                      name="position"
                      value={form.position}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select>
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Salary
                    </label>
                    <input
                      type="number"
                      name="salary"
                      value={form.salary}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job URL
                  </label>
                  <input
                    type="url"
                    name="jobUrl"
                    value={form.jobUrl}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                  >
                    {saving ? "Saving..." : "Saving Changes"}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              // View mode
              <dl className="grid grid-cols-2 gap-4">
                {[
                  { label: "Company", value: job.company },
                  { label: "Position", value: job.position },
                  {
                    label: "Status",
                    value: <StatusBadge status={job.status as JobStatus} />,
                  },
                  {
                    label: "Applied",
                    value: new Date(job.appliedDate).toLocaleDateString(),
                  },
                  {
                    label: "Salary",
                    value: job.salary ? `$${job.salary.toLocaleString()}` : "-",
                  },
                  { label: "Location", value: job.location ?? "-" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <dl className="text-xs text-gray-400 uppercase tracking-wide">
                      {label}
                    </dl>
                    <dd className="text-gray-800 font-medium mt-1">{value}</dd>
                  </div>
                ))}

                {job.jobUrl && (
                  <div className="col-span-2">
                    <dt className="text-xs text-gray-400 uppercase tracking-wide">
                      Job URL
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={job.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm truncate block"
                      >
                        {job.jobUrl}
                      </a>
                    </dd>
                  </div>
                )}

                {job.notes && (
                  <div className="col-span-2">
                    <dt className="text-xs text-gray-400 uppercase tracking-wide">
                      Notes
                    </dt>
                    <dd className="text-gray-700 mt-1 text-sm whitespace-pre-wrap">
                      {job.notes}
                    </dd>
                  </div>
                )}
              </dl>
            )}
          </div>

          {/* Resume Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Resume / CV</h3>

            {job.resumeUrl ? (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📄</span>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Resume attached
                    </p>
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_URL}${job.resumeUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-xs hover:underline"
                    >
                      Download
                    </a>
                  </div>
                </div>
                <div className="flex gap-2">
                  <label className="cursor-pointer px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                    Replace
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={handleResumeDelete}
                    className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <span className="text-3xl mb-2">📎</span>
                <span className="text-sm font-medium text-gray-600">
                  {uploadingResume ? "Uploading..." : "Click to upload resume"}
                </span>
                <span className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX — max 5MB</span>
                <input 
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                disabled={uploadingResume}
                className="hidden"
                />
              </label>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

