import { describe, expect, it } from "vitest";
import { globalSearchConfig, searchEntities } from "./global-search";

describe("global search", () => {
  it("uses Cmd+K shortcut", () => {
    expect(globalSearchConfig.shortcut).toBe("Cmd+K");
  });

  it("filters entities by title and subtitle", () => {
    const entities = [
      { id: "1", title: "SQL Injection", subtitle: "critical attack", entityType: "attack" as const, route: "/attacks-feed/1" },
      { id: "2", title: "Policy Bundle Alpha", subtitle: "runtime policy", entityType: "policy" as const, route: "/policy-bundles/alpha" }
    ];

    expect(searchEntities("sql", entities)).toHaveLength(1);
    expect(searchEntities("runtime", entities)).toHaveLength(1);
  });
});
