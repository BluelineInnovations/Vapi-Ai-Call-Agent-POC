import { NextRequest, NextResponse } from "next/server";

/**
 * Validates DEMO_API_KEY via Authorization: Bearer <key> or x-api-key.
 * Returns null when authorized; otherwise an error NextResponse.
 */
export function requireApiKey(request: NextRequest): NextResponse | null {
  const expected = process.env.DEMO_API_KEY;
  if (!expected) {
    console.error("DEMO_API_KEY is not configured");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }

  const authHeader = request.headers.get("authorization");
  const bearer =
    authHeader?.toLowerCase().startsWith("bearer ")
      ? authHeader.slice(7).trim()
      : null;
  const headerKey = request.headers.get("x-api-key")?.trim() ?? null;
  const provided = bearer || headerKey;

  if (!provided || provided !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
