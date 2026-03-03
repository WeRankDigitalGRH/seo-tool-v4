"use client";

const STYLES: Record<string, { bg: string; border: string; color: string }> = {
  critical: { bg: "bg-red-50", border: "border-red-300", color: "text-red-600" },
  warning: { bg: "bg-amber-50", border: "border-amber-300", color: "text-amber-600" },
  good: { bg: "bg-green-50", border: "border-green-300", color: "text-green-600" },
  info: { bg: "bg-blue-50", border: "border-blue-300", color: "text-blue-600" },
};
const ICONS: Record<string, string> = { critical: "X", warning: "!", good: "V", info: "i" };
const LABELS: Record<string, string> = { critical: "Critical", warning: "Warning", good: "Passed", info: "Info" };

export function SeverityBadge({ severity }: { severity: string }) {
  const s = STYLES[severity] || STYLES.info;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${s.bg} ${s.border} ${s.color} uppercase tracking-wide shrink-0`}>
      <span className="text-[10px]">{ICONS[severity]}</span>
      {LABELS[severity]}
    </span>
  );
}
