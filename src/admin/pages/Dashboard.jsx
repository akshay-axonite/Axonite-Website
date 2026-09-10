import { useEffect, useState } from "react";
import { getStats, getBlogPosts, getJobs } from "../../lib/store";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ pageviews: 0, sessions: 0, breakdown: {} });
  const [postCount, setPostCount] = useState(0);
  const [jobCount, setJobCount] = useState(0);

  useEffect(() => {
    setStats(getStats());
    setPostCount(getBlogPosts().length);
    setJobCount(getJobs().length);
  }, []);

  const topPages = Object.entries(stats.breakdown).sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <div className="p-8 max-w-5xl">
      <p className="font-mono-label text-[11px] text-signal-dim mb-2">Overview</p>
      <h1 className="font-display text-3xl font-semibold mb-8">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {/* <StatCard label="Page views" value={stats.pageviews} /> */}
        <StatCard label="Visits" value={stats.sessions} />
        <StatCard label="Blog posts" value={postCount} />
        <StatCard label="Open roles" value={jobCount} />
      </div>

      {/* <div className="bg-white border border-line-soft rounded-2xl p-6">
        <h2 className="font-display text-lg font-semibold mb-1">Most viewed pages</h2>
        <p className="text-xs text-graphite mb-5">Recorded on this device — see note below.</p>
        {topPages.length === 0 ? (
          <p className="text-sm text-graphite">No page views recorded yet.</p>
        ) : (
          <ul className="divide-y divide-line-soft">
            {topPages.map(([path, count]) => (
              <li key={path} className="flex items-center justify-between py-3 text-sm">
                <span className="font-mono-label text-[11px] text-ink">
                  {path === "/" ? "/ (home)" : path}
                </span>
                <span className="text-graphite">{count}</span>
              </li>
            ))}
          </ul>
        )}
      </div> */}

      <div className="bg-signal/5 border border-line-soft rounded-2xl p-6 mt-6">
        <p className="text-xs text-graphite leading-relaxed max-w-2xl">
          <strong className="text-ink">About these numbers:</strong> this dashboard
          currently stores everything in your browser, so page views and visits only
          count what happens on this device — they won't reflect visitors on other
          computers or phones. For real, site-wide analytics, connect a service like
          Plausible, Fathom, or Google Analytics, or wire this dashboard up to a
          backend once you have one.
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-line-soft rounded-2xl p-6">
      <p className="font-mono-label text-[10px] text-signal-dim mb-2">{label}</p>
      <p className="font-display text-3xl font-semibold">{value}</p>
    </div>
  );
}
