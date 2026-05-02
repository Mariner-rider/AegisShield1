import { defaultWidgets } from "../components/widgets";

export const overviewDashboardPage = {
  id: "overview",
  title: "Security Command Center",
  subtitle: "Realtime protection posture across apps, APIs, and identities.",
  widgets: defaultWidgets,
  heroStats: [
    { label: "Protection score", value: "98.4", delta: "+0.7" },
    { label: "Critical events", value: "5", delta: "-2" },
    { label: "Mean time to resolve", value: "7m 21s", delta: "-12%" }
  ],
  loadingState: "Loading realtime telemetry and model decisions...",
  emptyState: "No telemetry yet. Connect your first protected app to begin."
};
