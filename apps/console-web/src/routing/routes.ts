import { consolePages } from "../pages/sections";
import { overviewDashboardPage } from "../pages/dashboard";

export const routes = [
  { path: "/overview", page: overviewDashboardPage.id },
  ...consolePages.map((p) => ({ path: p.route, page: p.id }))
];
