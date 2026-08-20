import Link from "next/link";

const FEATURES = [
  {
    icon: "📨",
    title: "Track Applications",
    desc: "Log every job you apply to in one place",
  },
  {
    icon: "🎙️",
    title: "Interview Pipeline",
    desc: "Move applications through 5 stages",
  },
  {
    icon: "🔍",
    title: "Search & Filter",
    desc: "Find any application instantly",
  },
  {
    icon: "📊",
    title: "Dashboard Analytics",
    desc: "See your success rate and pipeline health",
  },
  {
    icon: "📎",
    title: "Resume Storage",
    desc: "Attach CVs to each application",
  },
  {
    icon: "📧",
    title: "Email Notifications",
    desc: "Get notified on status changes",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 px-6 py-4 flex justify-between items-center max-w-6xl mx-auto">
        <h1 className="text-xl font-bold text-blue-600">📋 Job Tracker</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          Track your job search
        </h2>
        <p>
          Stop losing search of where you applied. Job Tracker keeps your entire
          job search organized in one clean dashboard.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/register"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-lg"
          >
            Start Tracking Free →
          </Link>
          <Link
            href="/login"
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-lg"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-12">
            Everything you need to manage your job search
          </h3>
          <div className="grid grid-cols-3 gap-6">
            {FEATURES.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <span className="text-3xl">{icon}</span>
                <h4 className="font-semibold text-gray-800 mt-3 mb-1">
                  {title}
                </h4>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline stages */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Track every stage of your pipeline
        </h3>
        <p className="text-gray-500 mb-10">
          Move application through stages as you progress
        </p>
        <div className="flex justify-center items-center gap-2 flex-wrap">
          {[
            { label: "📨 Applied", color: "bg-blue-100 text-blue-800" },
            { label: "→", color: "text-gray-400" },
            { label: "🎙️ Interview", color: "bg-purple-100 text-purple-800" },
            { label: "→", color: "text-gray-400" },
            { label: "📝 Assessment", color: "bg-yellow-100 text-yellow-800" },
            { label: "→", color: "text-gray-400" },
            { label: "🎉 Offer", color: "bg-green-100 text-green-800" },
          ].map(({ label, color }, i) => (
            <span
              key={i}
              className={`px-4 py-2 rounded-full text-sm font-medium ${color}`}
            >
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16 text-center">
        <h3 className="text-3xl font-bold text-white mb-4">
          Ready to organise your job search?
        </h3>
        <p className="text-blue-100 mb-8">
          Free to use. No credit card required.
        </p>
        <Link
          href="/register"
          className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors inline-block"
        >
          Create Free Account →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-gray-400 text-sm">
        <p>
          Built with Next.js + TypeScript |{" "}
          <a
            href="https://github.com/MastaR-svg/job-tracker-api"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            API on GitHub
          </a>{" "}
          |{" "}
          <a
            href="https://job-tracker-api-production-5674.up.railway.app/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            API Docs
          </a>
        </p>
      </footer>
    </div>
  );
}
