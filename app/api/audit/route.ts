import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { audits, auditCategories } from "@/lib/db/schema";
import { SEO_AUDIT_SYSTEM_PROMPT, buildAuditUserPrompt } from "@/lib/audit-prompt";

let _client: Anthropic | null = null;
function getClient() {
  if (!_client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not set. Add it to Vercel env vars.");
    }
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

function normalizeUrl(input: string): string {
  let url = input.trim();
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  try {
    const parsed = new URL(url);
    return parsed.origin + parsed.pathname.replace(/\/+$/, "");
  } catch {
    return url;
  }
}

function extractJson(text: string): Record<string, unknown> | null {
  const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
}

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    return await handleAudit(req);
  } catch (e: any) {
    console.error("Unhandled audit error:", e);
    return NextResponse.json(
      { error: e?.message || "An unexpected error occurred. Check your API key and try again." },
      { status: 500 }
    );
  }
}

async function handleAudit(req: NextRequest) {
  const startTime = Date.now();
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const normalizedUrl = normalizeUrl(url);

    const message = await getClient().messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      system: SEO_AUDIT_SYSTEM_PROMPT,
      tools: [{ type: "web_search_20250305", name: "web_search" }] as any,
      messages: [{ role: "user", content: buildAuditUserPrompt(normalizedUrl) }],
    });

    let jsonText = "";
    for (const block of message.content) {
      if (block.type === "text") jsonText += block.text;
    }

    const parsed = extractJson(jsonText);
    if (!parsed || !parsed.categories || !parsed.overallScore) {
      return NextResponse.json({ error: "Failed to parse audit results. Please try again." }, { status: 502 });
    }

    const durationMs = Date.now() - startTime;

    try {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

      const [inserted] = await db.insert(audits).values({
        url,
        normalizedUrl,
        overallScore: parsed.overallScore as number,
        summary: (parsed.summary as string) || null,
        categories: parsed.categories as Record<string, unknown>,
        topPriorities: (parsed.topPriorities as string[]) || null,
        ipAddress: ip,
        userAgent: req.headers.get("user-agent") || null,
        durationMs,
      }).returning({ id: audits.id });

      if (inserted) {
        const cats = parsed.categories as Record<string, { score: number; issues: any[] }>;
        const rows = Object.entries(cats).map(([key, cat]) => ({
          auditId: inserted.id,
          category: key,
          score: cat.score,
          issueCount: cat.issues?.length || 0,
          criticalCount: cat.issues?.filter((i: any) => i.severity === "critical").length || 0,
          warningCount: cat.issues?.filter((i: any) => i.severity === "warning").length || 0,
        }));
        await db.insert(auditCategories).values(rows);
      }

      return NextResponse.json({ ...parsed, id: inserted?.id, durationMs });
    } catch (dbErr) {
      console.error("DB write failed (non-fatal):", dbErr);
      return NextResponse.json({ ...parsed, durationMs });
    }
  } catch (error: any) {
    console.error("Audit error:", error);
    if (error?.status === 429) {
      return NextResponse.json({ error: "Rate limited. Please wait and try again." }, { status: 429 });
    }
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
