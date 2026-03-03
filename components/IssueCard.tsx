"use client";

import { useState } from "react";
import { SeverityBadge } from "./SeverityBadge";

interface Issue {
  title: string;
  severity: string;
  description: string;
  recommendation: string;
}

export function IssueCard({ issue }: { issue: Issue }) {
  const [open, setOpen] = useState(false);
  const arrow = open ? String.fromCharCode(9650) : String.fromCharCode(9660);

  return (
    <div
      onClick={() => setOpen(!open)}
      className={`bg-white rounded-xl border px-4 py-3.5 cursor-pointer transition-all duration-200 ${
        open ? "border-slate-300 shadow-md" : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <SeverityBadge severity={issue.severity} />
          <span className={`text-sm font-semibold text-slate-800 ${open ? "" : "truncate"}`}>
            {issue.title}
          </span>
        </div>
        <span className="text-lg text-slate-400 shrink-0">{arrow}</span>
      </div>
      {open && (
        <div className="mt-3.5 space-y-3">
          <p className="text-sm text-slate-600 leading-relaxed">{issue.description}</p>
          <div className="bg-green-50 rounded-lg p-3 border-l-[3px] border-green-500">
            <div className="text-xs font-bold text-green-700 mb-1 uppercase tracking-wider">Recommendation</div>
            <p className="text-sm text-green-800 leading-relaxed">{issue.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
