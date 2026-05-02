export interface DetectionRow {
  id: string;
  ruleId: string;
  ruleName: string;
  confidence: number;
  disposition: "open" | "resolved" | "false-positive";
  environment: string;
  detectedAt: string;
}

export interface DetectionsFilters {
  severities: string[];
  environments: string[];
  dateRange?: { from: string; to: string };
  includeFalsePositives: boolean;
}

export const detectionsPage = {
  id: "detections",
  title: "Detections",
  route: "/detections",
  filterable: true,
  supportsFalsePositiveFlagging: true,
  columns: ["detectedAt", "ruleId", "ruleName", "confidence", "environment", "disposition"],
  defaultFilters: {
    severities: ["high", "critical"],
    environments: ["prod"],
    includeFalsePositives: false
  } satisfies DetectionsFilters,
  rows: [] as DetectionRow[]
};
