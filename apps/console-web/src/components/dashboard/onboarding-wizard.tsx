"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
const steps = ["Organization", "Project", "Integration", "Verify"];
export function OnboardingWizard() {
  const [idx, setIdx] = useState(0);
  return <section className="rounded-lg border border-slate-700 p-4" aria-label="Onboarding wizard"><h2 className="font-semibold">Onboarding Wizard</h2><p className="text-sm text-slate-400">Step {idx + 1}: {steps[idx]}</p><div className="mt-2"><Button onClick={() => setIdx((v) => Math.min(v + 1, steps.length - 1))}>Next step</Button></div></section>;
}
