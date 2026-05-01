import { ComplianceMapping, Framework, PolicyRecord } from "../types";

const frameworkControls: Record<Framework, string[]> = {
  OWASP_TOP_10_2025: ["A01", "A02", "A03", "A05", "A09"],
  ISO_27001_BASIC: ["A.5", "A.8", "A.9", "A.12", "A.16"],
  NIST_CSF_HIGH_LEVEL: ["Identify", "Protect", "Detect", "Respond", "Recover"]
};

export function mapPoliciesToFrameworks(policies: PolicyRecord[]): ComplianceMapping[] {
  return (Object.keys(frameworkControls) as Framework[]).flatMap((framework) => {
    const controls = frameworkControls[framework];
    return controls.map((control) => {
      const matched = policies.filter((policy) => policy.frameworkTags.includes(framework));
      const enabled = matched.filter((policy) => policy.enabled);
      const status = enabled.length === 0 ? "gap" : enabled.length < matched.length ? "partial" : "covered";
      return {
        framework,
        control,
        policyIds: enabled.map((policy) => policy.id),
        status
      };
    });
  });
}
