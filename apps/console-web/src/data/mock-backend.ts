import { applySearch, FilterState } from "../components/search-filter";

const events = [
  { id: "e1", route: "/login", severity: "high", environment: "prod", sourceIp: "203.0.113.10", asn: "AS64500" },
  { id: "e2", route: "/admin", severity: "critical", environment: "prod", sourceIp: "198.51.100.1", asn: "AS64510" }
];

export function fetchEvents(filter: FilterState) { return applySearch(events, filter); }
