export type CitationStatus = "unpaid" | "paid" | "partial";

export type Citation = {
  citationNumber: string;
  pin: string;
  firstName: string;
  lastName: string;
  licensePlate: string;
  plateState: string;
  jurisdiction: string;
  state: string;
  violationDate: string;
  issueDate: string;
  dueDate: string;
  amountDue: number;
  lateFee: number;
  status: CitationStatus;
  violationType: string;
  speedPosted: number;
  speedRecorded: number;
  vehicleMake: string;
  vehicleColor: string;
};

/** Voice-friendly subset returned by the demo API. */
export type CitationSummary = {
  citationNumber: string;
  firstName: string;
  lastName: string;
  licensePlate: string;
  plateState: string;
  jurisdiction: string;
  status: CitationStatus;
  amountDue: number;
  lateFee: number;
  dueDate: string;
  violationDate: string;
  issueDate: string;
};

export type CitationLookupResponse = {
  count: number;
  citations: CitationSummary[];
};
