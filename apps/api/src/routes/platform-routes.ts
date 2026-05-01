export const routes = [
  "POST /signup",
  "POST /login",
  "POST /organizations",
  "POST /organizations/:orgId/tenants",
  "POST /tenants/:tenantId/projects",
  "POST /tenants/:tenantId/projects/:projectId/environments",
  "POST /tenants/:tenantId/api-keys",
  "POST /tenants/:tenantId/api-keys/:keyId/rotate",
  "POST /tenants/:tenantId/api-keys/:keyId/revoke",
  "GET /organizations/:orgId/subscription",
  "POST /organizations/:orgId/trial/start"
];
