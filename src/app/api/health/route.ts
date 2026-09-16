import { NextResponse } from "next/server";
import { getCitationCount } from "@/lib/citations";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "citation-demo-api",
    citationCount: getCitationCount(),
  });
}
