import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { audits } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");
    const urlFilter = searchParams.get("url");

    const baseQuery = db.select({
      id: audits.id,
      url: audits.url,
      overallScore: audits.overallScore,
      summary: audits.summary,
      createdAt: audits.createdAt,
    }).from(audits);

    const results = urlFilter
      ? await baseQuery.where(eq(audits.normalizedUrl, urlFilter)).orderBy(desc(audits.createdAt)).limit(limit).offset(offset)
      : await baseQuery.orderBy(desc(audits.createdAt)).limit(limit).offset(offset);

    return NextResponse.json({ audits: results, limit, offset });
  } catch (error: unknown) {
    console.error("History error:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
