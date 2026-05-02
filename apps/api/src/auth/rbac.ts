export type Role = "super_admin" | "admin" | "analyst" | "viewer";

const roleWeight: Record<Role, number> = { super_admin: 4, admin: 3, analyst: 2, viewer: 1 };

export function hasRole(required: Role, actual: Role): boolean {
  return roleWeight[actual] >= roleWeight[required];
}
