import { describe, it, expect } from "vitest";
import { redactSecret } from "./redaction";
import { applySearch } from "./search-filter";
import { routes } from "../routing/routes";

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
});
