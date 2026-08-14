import { API_ROUTES } from "@/constants/apiRoute";
import { apiClient } from "@/libs/api";
import type { RoleDto, CreateRolePayload, UpdateRolePayload } from "@/types";

export const roleService = {
  list(): Promise<RoleDto[]> {
    return apiClient.get<RoleDto[]>(API_ROUTES.ROLES.LIST);
  },

  create(data: CreateRolePayload): Promise<RoleDto> {
    return apiClient.post<RoleDto>(API_ROUTES.ROLES.CREATE, data);
  },

  update(id: string, data: UpdateRolePayload): Promise<RoleDto> {
    return apiClient.patch<RoleDto>(API_ROUTES.ROLES.byId(id), data);
  },

  delete(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(API_ROUTES.ROLES.byId(id));
  },
};
