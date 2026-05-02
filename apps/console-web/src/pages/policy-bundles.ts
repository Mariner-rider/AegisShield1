export interface PolicyRuleNode {
  id: string;
  name: string;
  category: "access" | "request" | "response" | "runtime";
}

export interface PolicyBundleDraft {
  id: string;
  name: string;
  version: string;
  rules: PolicyRuleNode[];
}

export const policyBundlesPage = {
  id: "policy-bundles",
  title: "Policy Bundles",
  route: "/policy-bundles",
  editorMode: "visual",
  supportsDragDropRules: true,
  paletteCategories: ["access", "request", "response", "runtime"],
  bundles: [] as PolicyBundleDraft[]
};
