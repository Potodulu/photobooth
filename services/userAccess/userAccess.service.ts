import { API_ROUTES } from "@/constants/apiRoute";
import { apiClient, type ApiPaginatedData } from "@/libs/api";
import type {
  UserAccountDto,
  CreateUserPayload,
  UpdateUserPayload,
  RoleCode,
} from "@/types";

export const userAccessService = {
  list(
    role?: RoleCode,
    page = 1,
    per_page = 20,
  ): Promise<ApiPaginatedData<UserAccountDto>> {
    const params = new URLSearchParams();
    if (role) params.set("role", role);
    params.set("page", String(page));
    params.set("per_page", String(per_page));

    const queryString = params.toString();
    const url = `${API_ROUTES.USER_ACCESS.LIST}${queryString ? `?${queryString}` : ""}`;

    return apiClient.get<ApiPaginatedData<UserAccountDto>>(url);
  },

  create(data: CreateUserPayload): Promise<UserAccountDto> {
    return apiClient.post<UserAccountDto>(API_ROUTES.USER_ACCESS.CREATE, data);
  },

  update(id: string, data: UpdateUserPayload): Promise<UserAccountDto> {
    return apiClient.patch<UserAccountDto>(
      API_ROUTES.USER_ACCESS.byId(id),
      data,
    );
  },

  inactivate(id: string): Promise<UserAccountDto> {
    return apiClient.post<UserAccountDto>(
      API_ROUTES.USER_ACCESS.inactivate(id),
    );
  },
};
