export interface SearchEntity {
  id: string;
  title: string;
  subtitle?: string;
  entityType: "attack" | "detection" | "response" | "policy" | "audit" | "setting";
  route: string;
}

export const globalSearchConfig = {
  shortcut: "Cmd+K",
  placeholder: "Search attacks, detections, responses, policies, audit logs, settings...",
  scopes: ["attack", "detection", "response", "policy", "audit", "setting"],
  limit: 20
};

export function searchEntities(query: string, entities: SearchEntity[]): SearchEntity[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return entities.slice(0, globalSearchConfig.limit);
  return entities
    .filter((entity) => `${entity.title} ${entity.subtitle ?? ""}`.toLowerCase().includes(normalized))
    .slice(0, globalSearchConfig.limit);
}
