import type { RoleCode } from "@/types";

export const ROLES = {
  ADMIN: "admin",
  CONTRIBUTOR: "contributor",
  USER: "user",
} as const satisfies Record<string, RoleCode>;

export function hasRole(
  userRole: RoleCode | null,
  allowed: RoleCode[],
): boolean {
  if (!userRole) return false;
  return allowed.includes(userRole);
}
