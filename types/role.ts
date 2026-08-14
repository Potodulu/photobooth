export type RoleDto = {
  id: string;
  code: string;
  name: string;
  description: string;
  permissions: string[];
  user_count: number;
  created_at: string;
  updated_at: string;
};

export type CreateRolePayload = {
  code: string;
  name: string;
  description: string;
  permissions: string[];
};

export type UpdateRolePayload = Partial<Omit<CreateRolePayload, "code">>;
