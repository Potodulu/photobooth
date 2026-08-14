import { API_ROUTES } from "@/constants/apiRoute";
import { apiClient } from "@/libs/api";
import type { RoleDto, CreateRolePayload, UpdateRolePayload } from "@/types";

// ponytail: mock memory store until backend role endpoints are connected
const MOCK_ROLES: RoleDto[] = [
  {
    id: "r-admin",
    name: "Admin",
    code: "ADMIN",
    description: "System Administrator with full permissions",
    permissions: ["all"],
    user_count: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "r-contributor",
    name: "Contributor",
    code: "CONTRIBUTOR",
    description: "Content Contributor for frames and layouts",
    permissions: ["frame.create", "layout.create"],
    user_count: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "r-user",
    name: "User",
    code: "USER",
    description: "Standard end user",
    permissions: ["photo.capture", "photo.download"],
    user_count: 120,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const roleService = {
  async list(): Promise<RoleDto[]> {
    // ponytail: fallback to local mock data if backend not connected
    try {
      return await apiClient.get<RoleDto[]>(API_ROUTES.ROLES.LIST);
    } catch {
      return MOCK_ROLES;
    }
  },

  async create(data: CreateRolePayload): Promise<RoleDto> {
    try {
      return await apiClient.post<RoleDto>(API_ROUTES.ROLES.CREATE, data);
    } catch {
      const newRole: RoleDto = {
        id: `r-${Date.now()}`,
        name: data.name,
        code: data.code as RoleDto["code"],
        description: data.description,
        permissions: data.permissions || [],
        user_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      MOCK_ROLES.push(newRole);
      return newRole;
    }
  },

  async update(id: string, data: UpdateRolePayload): Promise<RoleDto> {
    try {
      return await apiClient.patch<RoleDto>(API_ROUTES.ROLES.byId(id), data);
    } catch {
      const idx = MOCK_ROLES.findIndex((r) => r.id === id);
      if (idx !== -1) {
        MOCK_ROLES[idx] = {
          ...MOCK_ROLES[idx],
          ...data,
          updated_at: new Date().toISOString(),
        };
        return MOCK_ROLES[idx];
      }
      throw new Error("Role not found");
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete<void>(API_ROUTES.ROLES.byId(id));
    } catch {
      const idx = MOCK_ROLES.findIndex((r) => r.id === id);
      if (idx !== -1) MOCK_ROLES.splice(idx, 1);
    }
  },
};
