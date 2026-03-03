"use client";

export function PriorityList({ priorities }: { priorities: string[] }) {
  if (!priorities?.length) return null;
  return (
    <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-2xl border border-amber-300 p-6">
      <div className="flex items-center gap-2.5 mb-4">
        <h3 className="text-lg font-bold text-amber-900">Top Priorities - Fix These First</h3>
      </div>
      <div className="space-y-2.5">
        {priorities.map((p, i) => (
          <div key={i} className="flex items-start gap-3 p-3.5 bg-white/70 rounded-xl backdrop-blur-sm">
            <span className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-extrabold shrink-0">
              {i + 1}
            </span>
            <span className="text-sm text-amber-950 leading-relaxed font-medium">{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
