import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "@/lib/auth";
import { findByCitationNumber, toSummary } from "@/lib/citations";

type RouteContext = {
  params: Promise<{ citationNumber: string }>;
};

/**
 * GET /api/citations/:citationNumber
 * Lookup a single citation by citation number.
 */
export async function GET(request: NextRequest, context: RouteContext) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const { citationNumber } = await context.params;
  const citation = findByCitationNumber(decodeURIComponent(citationNumber));

  if (!citation) {
    console.info(
      JSON.stringify({
        route: "GET /api/citations/:citationNumber",
        outcome: "not_found",
      }),
    );
    return NextResponse.json({ error: "Citation not found" }, { status: 404 });
  }

  const summary = toSummary(citation);
  console.info(
    JSON.stringify({
      route: "GET /api/citations/:citationNumber",
      outcome: "ok",
    }),
  );

  return NextResponse.json({
    count: 1,
    citations: [summary],
  });
}
