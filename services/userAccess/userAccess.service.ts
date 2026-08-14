import { API_ROUTES } from "@/constants/apiRoute";
import { apiClient } from "@/libs/api";
import type {
  UserAccountDto,
  CreateUserPayload,
  UpdateUserPayload,
  RoleCode,
} from "@/types";

// ponytail: mock memory store until backend user access endpoints are connected
const MOCK_USERS: UserAccountDto[] = [
  {
    id: "u-1",
    email: "user1@potodulu.com",
    full_name: "Regular User One",
    role: "USER",
    status: "active",
    phone: "081234567890",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "u-2",
    email: "contrib1@potodulu.com",
    full_name: "Contributor One",
    role: "CONTRIBUTOR",
    status: "active",
    phone: "089876543210",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const userAccessService = {
  async list(role?: RoleCode): Promise<UserAccountDto[]> {
    // ponytail: fallback to local mock data if backend not connected
    try {
      const res = await apiClient.get<UserAccountDto[]>(
        API_ROUTES.USER_ACCESS.LIST + (role ? `?role=${role}` : ""),
      );
      return res;
    } catch {
      return role ? MOCK_USERS.filter((u) => u.role === role) : MOCK_USERS;
    }
  },

  async create(data: CreateUserPayload): Promise<UserAccountDto> {
    try {
      return await apiClient.post<UserAccountDto>(
        API_ROUTES.USER_ACCESS.CREATE,
        data,
      );
    } catch {
      const newUser: UserAccountDto = {
        id: `u-${Date.now()}`,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        status: "active",
        phone: data.phone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      MOCK_USERS.push(newUser);
      return newUser;
    }
  },

  async update(id: string, data: UpdateUserPayload): Promise<UserAccountDto> {
    try {
      return await apiClient.patch<UserAccountDto>(
        API_ROUTES.USER_ACCESS.byId(id),
        data,
      );
    } catch {
      const idx = MOCK_USERS.findIndex((u) => u.id === id);
      if (idx !== -1) {
        MOCK_USERS[idx] = {
          ...MOCK_USERS[idx],
          ...data,
          updated_at: new Date().toISOString(),
        };
        return MOCK_USERS[idx];
      }
      throw new Error("User not found");
    }
  },

  async inactivate(id: string): Promise<void> {
    try {
      await apiClient.post<void>(API_ROUTES.USER_ACCESS.inactivate(id));
    } catch {
      const user = MOCK_USERS.find((u) => u.id === id);
      if (user) user.status = "inactive";
    }
  },
};
