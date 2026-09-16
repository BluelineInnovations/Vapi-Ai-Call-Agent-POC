import citationsData from "@/data/citations.json";
import type {
  Citation,
  CitationLookupResponse,
  CitationSummary,
} from "@/lib/types";

const citations = citationsData as Citation[];

export function normalizePlate(plate: string): string {
  return plate.replace(/[\s\-]/g, "").toUpperCase();
}

/**
 * Normalize a citation number for lookup.
 * Accepts optional "BL-" / "BL" prefix (case-insensitive); the stored POC
 * values are the core id only: 1–3 digits + 6 alphanumeric characters.
 */
export function normalizeCitationNumber(citationNumber: string): string {
  let value = citationNumber.replace(/\s+/g, "").toUpperCase();
  if (value.startsWith("BL-")) {
    value = value.slice(3);
  } else if (value.startsWith("BL") && value.length > 2 && /[0-9]/.test(value[2])) {
    value = value.slice(2);
  }
  return value;
}

export function toSummary(citation: Citation): CitationSummary {
  return {
    citationNumber: citation.citationNumber,
    firstName: citation.firstName,
    lastName: citation.lastName,
    licensePlate: citation.licensePlate,
    plateState: citation.plateState,
    jurisdiction: citation.jurisdiction,
    location: citation.location,
    status: citation.status,
    amountDue: citation.amountDue,
    lateFee: citation.lateFee,
    dueDate: citation.dueDate,
    violationDate: citation.violationDate,
    issueDate: citation.issueDate,
  };
}

export function findByCitationNumber(
  citationNumber: string,
): Citation | undefined {
  const target = normalizeCitationNumber(citationNumber);
  return citations.find(
    (c) => normalizeCitationNumber(c.citationNumber) === target,
  );
}

export function findByPlate(
  plate: string,
  state?: string,
): CitationLookupResponse {
  const normalizedPlate = normalizePlate(plate);
  const normalizedState = state?.trim().toUpperCase();

  const matches = citations.filter((c) => {
    const plateMatch = normalizePlate(c.licensePlate) === normalizedPlate;
    if (!plateMatch) return false;
    if (!normalizedState) return true;
    return c.plateState.toUpperCase() === normalizedState;
  });

  return {
    count: matches.length,
    citations: matches.map(toSummary),
  };
}

export function getCitationCount(): number {
  return citations.length;
}
