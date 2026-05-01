import { defaultWidgets } from "../components/widgets";
export const overviewDashboardPage = {
  id: "overview",
  title: "Security Overview",
  widgets: defaultWidgets,
  loadingState: "Loading security telemetry...",
  emptyState: "No telemetry yet. Connect your first protected app to begin."
};
