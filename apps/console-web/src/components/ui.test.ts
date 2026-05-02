import { describe, it, expect } from "vitest";
import { redactSecret } from "./redaction";
import { applySearch } from "./search-filter";
import { routes } from "../routing/routes";
import { cloudShieldDarkTheme } from "./theme";
import { navItems, shellLayout } from "./layout";

describe("console ui helpers", () => {
  it("redacts sensitive values", () => {
    expect(redactSecret("abcdefghijklmnop")).toBe("abcd...mnop");
  });

  it("search filters items", () => {
    const out = applySearch([{ route: "/login" }, { route: "/admin" }], { query: "admin" });
    expect(out).toHaveLength(1);
  });

  it("includes required routes", () => {
    expect(routes.some(r => r.path === "/overview")).toBe(true);
    expect(routes.some(r => r.path === "/audit-trail")).toBe(true);
  });

  it("provides modern theme tokens", () => {
    expect(cloudShieldDarkTheme.mode).toBe("dark");
    expect(cloudShieldDarkTheme.brand[500]).toBeTruthy();
    expect(shellLayout.sidebarWidth).toBeGreaterThan(240);
  });

  it("uses icon-enabled navigation", () => {
    expect(navItems.every(item => item.icon.length > 0)).toBe(true);
  });
});
