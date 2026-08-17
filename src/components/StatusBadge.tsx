import { JobStatus } from "@/types";

const STATUS_CONFIG: Record<JobStatus, { label: string; className: string }> = {
  applied: { label: "📨 Applied", className: "bg-blue-100 text-blue-800" },
  interview: {
    label: "🎙️ Interview",
    className: "bg-purple-100 text-purple-800",
  },
  assessment: {
    label: "📝 Assessment",
    className: "bg-yellow-100 text-yellow-800",
  },
  offer: { label: "🎉 Offer", className: "bg-green-100 text-green-800" },
  rejected: { label: "❌ Rejected", className: "bg-red-100 text-red-800" },
};

export default function StatusBadge({ status }: { status: JobStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
