import type { RoleCode } from "./auth";

export type RoleDto = {
  id: string;
  name: string;
  code: RoleCode;
  description: string;
  permissions: string[];
  user_count: number;
  created_at: string;
  updated_at: string;
};

export type CreateRolePayload = {
  name: string;
  code: string;
  description: string;
  permissions: string[];
};

export type UpdateRolePayload = Partial<CreateRolePayload>;
