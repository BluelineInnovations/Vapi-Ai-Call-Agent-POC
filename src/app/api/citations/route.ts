import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "@/lib/auth";
import { findByPlate } from "@/lib/citations";

/**
 * GET /api/citations?plate=&state=
 * Lookup citations by license plate (state optional).
 */
export async function GET(request: NextRequest) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const plate = request.nextUrl.searchParams.get("plate")?.trim();
  const state = request.nextUrl.searchParams.get("state")?.trim() || undefined;

  if (!plate) {
    return NextResponse.json(
      { error: "Query parameter 'plate' is required" },
      { status: 400 },
    );
  }

  const result = findByPlate(plate, state);
  console.info(
    JSON.stringify({
      route: "GET /api/citations",
      outcome: result.count === 0 ? "not_found" : "ok",
      count: result.count,
      hasState: Boolean(state),
    }),
  );

  return NextResponse.json(result);
}
