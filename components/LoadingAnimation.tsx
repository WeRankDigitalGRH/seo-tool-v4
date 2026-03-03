"use client";

const STEPS = [
  { label: "Fetching website", done: true },
  { label: "Analyzing HTML structure", done: true },
  { label: "Checking meta tags and SEO", done: true },
  { label: "Evaluating performance", done: true },
  { label: "Testing mobile readiness", done: true },
  { label: "Auditing security headers", done: true },
  { label: "Generating report", done: true },
];

export function LoadingAnimation({ progress, statusText }: { progress: number; statusText: string }) {
  const activeStep = Math.min(Math.floor(progress / (100 / STEPS.length)), STEPS.length - 1);

  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 shadow-lg">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3 animate-pulse-scale">{"\ud83d\udd0d"}</div>
        <h3 className="text-xl font-bold text-slate-900">Auditing Website</h3>
        <p className="text-sm text-slate-500 mt-1.5">{statusText || "This may take up to a minute..."}</p>
      </div>

      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-7">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, background: "linear-gradient(90deg, #6366f1, #0ea5e9, #10b981)" }}
        />
      </div>

      <div className="space-y-2.5">
        {STEPS.map((step, i) => {
          const isActive = i === activeStep;
          const isDone = i < activeStep;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                isActive ? "bg-sky-50" : isDone ? "bg-green-50" : ""
              }`}
              style={{ opacity: i > activeStep + 1 ? 0.35 : 1 }}
            >
              <span className={`text-sm w-7 text-center font-bold ${isDone ? "text-green-600" : isActive ? "text-sky-600" : "text-slate-300"}`}>
                {isDone ? "\u2713" : isActive ? ">" : (i + 1).toString()}
              </span>
              <span className={`text-sm ${isActive ? "font-bold text-sky-700" : isDone ? "font-semibold text-green-600" : "text-slate-400"}`}>
                {step.label}
              </span>
              {isActive && (
                <span className="ml-auto w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin-slow" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
