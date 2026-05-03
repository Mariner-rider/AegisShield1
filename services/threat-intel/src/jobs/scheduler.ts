import { fetchCisaAdvisories, fetchCisaKev, fetchDependencyAdvisories, loadManualIocList } from "../sources/fetchers";
import { dedupe, normalize } from "../pipeline/normalize";
import { BundlePipeline } from "../pipeline/signed-bundles";
import { ReviewQueue } from "../queue/review-queue";

export async function runThreatIntelIngestion(manualIocs: string[], bundleKey: string) {
  const raw = [
    ...(await fetchCisaKev()),
    ...(await fetchCisaAdvisories()),
    ...(await fetchDependencyAdvisories()),
    ...(await loadManualIocList(manualIocs))
  ];
  const normalized = dedupe(raw.map(normalize));

  const reviewQueue = new ReviewQueue();
  for (const n of normalized.filter(n => !n.lowRiskAutoApply)) reviewQueue.enqueue(n, "Operator review required before policy-impacting changes.");

  const bundles = new BundlePipeline(bundleKey);
  const lowRiskBundle = bundles.generateLowRiskBundle(normalized);

  return { normalized, lowRiskBundle, pendingReviews: reviewQueue.listPending() };
}
