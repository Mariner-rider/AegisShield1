export interface DetectorSignal { tag: string; weight: number; reason: string; }
export interface DecisionTrace { severity: number; reasons: string[]; tags: string[]; }

export function severityScore(signals: DetectorSignal[]): DecisionTrace {
  const severity = Math.min(100, signals.reduce((a, s) => a + s.weight, 0));
  return { severity, reasons: signals.map(s => s.reason), tags: signals.map(s => s.tag) };
}
