"use client";

import { useState } from "react";
import { ScoreRing } from "./ScoreRing";
import { IssueCard } from "./IssueCard";

interface CategoryData {
  score: number;
  issues: Array<{ title: string; severity: string; description: string; recommendation: string }>;
}

const META: Record<string, { label: string; icon: string; color: string }> = {
  technical: { label: "Technical SEO", icon: "T", color: "#6366f1" },
  onpage: { label: "On-Page SEO", icon: "P", color: "#0ea5e9" },
  content: { label: "Content Quality", icon: "C", color: "#8b5cf6" },
  performance: { label: "Performance", icon: "F", color: "#f59e0b" },
  mobile: { label: "Mobile & UX", icon: "M", color: "#10b981" },
  security: { label: "Security", icon: "S", color: "#ef4444" },
};

export function CategorySection({ categoryKey, data }: { categoryKey: string; data: CategoryData }) {
  const [filter, setFilter] = useState("all");
  const meta = META[categoryKey] || { label: categoryKey, icon: "?", color: "#6366f1" };

  const sorted = [...data.issues].sort((a, b) => {
    const order: Record<string, number> = { critical: 0, warning: 1, info: 2, good: 3 };
    return (order[a.severity] ?? 4) - (order[b.severity] ?? 4);
  });

  const filtered = filter === "all" ? sorted : sorted.filter((i) => i.severity === filter);
  const counts: Record<string, number> = { critical: 0, warning: 0, good: 0, info: 0 };
  data.issues.forEach((i) => { counts[i.severity] = (counts[i.severity] || 0) + 1; });

  const filters = [
    { key: "all", label: "All" },
    { key: "critical", label: `Critical (${counts.critical})` },
    { key: "warning", label: `Warnings (${counts.warning})` },
    { key: "good", label: `Passed (${counts.good})` },
    { key: "info", label: `Info (${counts.info})` },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div
        className="px-6 py-5 border-b border-slate-200 flex items-center justify-between"
        style={{ background: `linear-gradient(135deg, ${meta.color}08, ${meta.color}15)` }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white" style={{ background: meta.color }}>{meta.icon}</span>
          <div>
            <div className="text-lg font-bold text-slate-900">{meta.label}</div>
            <div className="text-xs text-slate-500 mt-0.5">{data.issues.length} checks performed</div>
          </div>
        </div>
        <ScoreRing score={data.score} size={64} strokeWidth={6} />
      </div>
      <div className="px-6 py-3 border-b border-slate-100 flex gap-1.5 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filter === f.key
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="p-5 space-y-2">
        {filtered.length === 0 ? (
          <p className="text-center py-6 text-slate-400 text-sm">No issues match this filter</p>
        ) : (
          filtered.map((issue, i) => <IssueCard key={i} issue={issue} />)
        )}
      </div>
    </div>
  );
}
