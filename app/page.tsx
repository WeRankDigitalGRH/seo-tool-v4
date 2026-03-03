"use client";

import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import { ScoreRing } from "@/components/ScoreRing";
import { CategorySection } from "@/components/CategorySection";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { PriorityList } from "@/components/PriorityList";

const CATEGORY_META: Record<string, { label: string; icon: string; color: string }> = {
  technical: { label: "Technical SEO", icon: "T", color: "#6366f1" },
  onpage: { label: "On-Page SEO", icon: "P", color: "#0ea5e9" },
  content: { label: "Content Quality", icon: "C", color: "#8b5cf6" },
  performance: { label: "Performance", icon: "F", color: "#f59e0b" },
  mobile: { label: "Mobile & UX", icon: "M", color: "#10b981" },
  security: { label: "Security", icon: "S", color: "#ef4444" },
};

interface AuditReport {
  id?: number;
  url: string;
  overallScore: number;
  summary: string;
  categories: Record<string, { score: number; issues: any[] }>;
  topPriorities: string[];
  durationMs?: number;
}

const STATUS_MESSAGES = [
  "Fetching website content...",
  "Analyzing HTML structure and meta tags...",
  "Evaluating on-page SEO elements...",
  "Checking performance indicators...",
  "Analyzing mobile responsiveness...",
  "Reviewing security configuration...",
  "Compiling comprehensive audit report...",
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [report, setReport] = useState<AuditReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);

  const clearIntervals = () => {
    intervalsRef.current.forEach(clearInterval);
    intervalsRef.current = [];
  };

  const runAudit = useCallback(async () => {
    const trimmed = url.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setProgress(0);
    setError(null);
    setReport(null);
    setStatusText("Initializing audit...");
    clearIntervals();

    const pInterval = setInterval(() => {
      setProgress((p) => (p >= 92 ? p : Math.min(p + Math.random() * 6 + 2, 92)));
    }, 2000);
    intervalsRef.current.push(pInterval);

    let msgIdx = 0;
    const sInterval = setInterval(() => {
      msgIdx = Math.min(msgIdx + 1, STATUS_MESSAGES.length - 1);
      setStatusText(STATUS_MESSAGES[msgIdx]);
    }, 4500);
    intervalsRef.current.push(sInterval);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Server error (${res.status})`);
      if (!data.categories || !data.overallScore) throw new Error("Incomplete audit data. Please try again.");

      clearIntervals();
      setProgress(100);
      setStatusText("Complete!");
      setTimeout(() => { setReport(data); setLoading(false); setActiveTab("overview"); }, 600);
    } catch (err: any) {
      clearIntervals();
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }, [url, loading]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") runAudit(); };

  const severityCounts = report
    ? Object.values(report.categories).reduce((acc, cat) => {
        cat.issues?.forEach((i: any) => { acc[i.severity] = (acc[i.severity] || 0) + 1; });
        return acc;
      }, { critical: 0, warning: 0, good: 0, info: 0 } as Record<string, number>)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/30 to-green-50/20">
      {/* Header */}
      <header className={`bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-center transition-all duration-300 ${report ? "py-5 sticky top-0 z-50 shadow-2xl" : "pt-14 pb-11"}`}>
        <div className="max-w-2xl mx-auto px-5">
          {!report && !loading && (
            <>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-200 via-white to-cyan-200 bg-clip-text text-transparent tracking-tight">
                SEO Audit Tool
              </h1>
              <p className="text-slate-400 text-base mt-2 mb-8 leading-relaxed">
                Comprehensive SEO analysis powered by AI - enter any URL to get started
              </p>
            </>
          )}
          <div className="flex gap-2 max-w-xl mx-auto bg-white/[0.07] rounded-2xl p-1.5 border border-white/10">
            <input
              type="text" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="Enter website URL (e.g. example.com)" disabled={loading}
              className="flex-1 px-4 py-3.5 rounded-xl bg-white/95 text-slate-900 text-base font-medium outline-none placeholder-slate-400 disabled:opacity-60"
            />
            <button onClick={runAudit} disabled={loading || !url.trim()}
              className="px-7 py-3.5 rounded-xl text-white text-base font-bold whitespace-nowrap transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: loading ? "#475569" : "linear-gradient(135deg, #6366f1, #0ea5e9)", cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "Auditing..." : report ? "Re-Audit" : "Run Audit"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5">
        {loading && <LoadingAnimation progress={progress} statusText={statusText} />}

        {error && !loading && (
          <div className="max-w-md mx-auto mt-10 p-7 bg-red-50 rounded-2xl border border-red-300 text-center">
            <h3 className="text-lg font-bold text-red-900 mb-2">Audit Failed</h3>
            <p className="text-sm text-red-700 leading-relaxed">{error}</p>
            <button onClick={runAudit} className="mt-4 px-7 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors">
              Try Again
            </button>
          </div>
        )}

        {report && !loading && (
          <div className="pt-7 pb-16">
            {/* Score card */}
            <div className="grid grid-cols-[auto_1fr] gap-7 bg-white rounded-2xl p-7 border border-slate-200 shadow-sm mb-6 items-center">
              <ScoreRing score={report.overallScore} size={140} strokeWidth={12} label="Overall Score" />
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 mb-2 leading-snug">{report.url}</h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{report.summary}</p>
                <div className="flex gap-4 flex-wrap">
                  {[
                    { key: "critical", label: "Critical", color: "#ef4444", bg: "bg-red-50" },
                    { key: "warning", label: "Warnings", color: "#f59e0b", bg: "bg-amber-50" },
                    { key: "good", label: "Passed", color: "#22c55e", bg: "bg-green-50" },
                    { key: "info", label: "Info", color: "#3b82f6", bg: "bg-blue-50" },
                  ].map((s) => (
                    <div key={s.key} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${s.bg}`}>
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                      <span className="text-sm font-bold" style={{ color: s.color }}>{severityCounts?.[s.key] || 0}</span>
                      <span className="text-xs text-slate-500 font-medium">{s.label}</span>
                    </div>
                  ))}
                </div>
                {report.durationMs && (
                  <p className="text-xs text-slate-400 mt-3">Audit completed in {(report.durationMs / 1000).toFixed(1)}s</p>
                )}
              </div>
            </div>

            {/* Nav tabs */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(105px,1fr))] gap-2.5 mb-6">
              <button onClick={() => setActiveTab("overview")}
                className={`rounded-xl py-4 px-2.5 text-center border transition-all ${activeTab === "overview" ? "bg-slate-900 border-slate-900 text-white shadow-lg" : "bg-white border-slate-200 hover:border-slate-300"}`}>
                <div className={`text-xs font-bold ${activeTab === "overview" ? "text-white" : "text-slate-600"}`}>Priorities</div>
              </button>
              {Object.entries(report.categories).map(([key, cat]) => {
                const meta = CATEGORY_META[key];
                if (!meta) return null;
                const isActive = activeTab === key;
                return (
                  <button key={key} onClick={() => setActiveTab(key)}
                    className="rounded-xl py-3 px-2 text-center border transition-all"
                    style={{ background: isActive ? meta.color : "#fff", borderColor: isActive ? meta.color : "#e2e8f0", boxShadow: isActive ? `0 4px 16px ${meta.color}30` : "none" }}>
                    <div className="text-2xl font-extrabold leading-tight"
                      style={{ color: isActive ? "#fff" : cat.score >= 80 ? "#22c55e" : cat.score >= 60 ? "#f59e0b" : "#ef4444" }}>
                      {cat.score}
                    </div>
                    <div className="text-[10px] font-semibold mt-0.5 uppercase tracking-wide"
                      style={{ color: isActive ? "rgba(255,255,255,0.85)" : "#64748b" }}>
                      {meta.label}
                    </div>
                  </button>
                );
              })}
            </div>

            {activeTab === "overview" ? (
              <PriorityList priorities={report.topPriorities} />
            ) : (
              report.categories[activeTab] && <CategorySection categoryKey={activeTab} data={report.categories[activeTab]} />
            )}
          </div>
        )}

        {!loading && !report && !error && (
          <div className="py-12 px-5">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-4 max-w-3xl mx-auto">
              {[
                { title: "Technical SEO", desc: "Crawlability, indexing, sitemaps, canonical tags, structured data" },
                { title: "On-Page SEO", desc: "Title tags, meta descriptions, headers, images, internal links" },
                { title: "Performance", desc: "Core Web Vitals, page speed, image optimization, caching" },
                { title: "Mobile & UX", desc: "Responsive design, viewport, touch targets, navigation" },
                { title: "Content Quality", desc: "Depth, E-E-A-T signals, keyword targeting, readability" },
                { title: "Security", desc: "HTTPS, mixed content, security headers, cookie policies" },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 text-left">
                  <div className="text-sm font-bold text-slate-900 mb-1.5">{item.title}</div>
                  <div className="text-xs text-slate-400 leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
            <p className="text-center text-slate-400 text-sm mt-8">
              Enter a URL above and click &quot;Run Audit&quot; to analyze any website across 40+ SEO factors
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
