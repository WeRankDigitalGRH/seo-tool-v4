import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { audits } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auditId = parseInt(id);
    if (isNaN(auditId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const [result] = await db.select().from(audits).where(eq(audits.id, auditId)).limit(1);
    if (!result) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("History detail error:", error);
    return NextResponse.json({ error: "Failed to fetch audit" }, { status: 500 });
  }
}
