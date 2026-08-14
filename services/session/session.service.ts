import { API_ROUTES } from "@/constants/apiRoute";
import { apiClient } from "@/libs/api";
import type { CreateSessionPayload, SessionDto } from "@/types";

export const sessionService = {
  create(data?: CreateSessionPayload): Promise<SessionDto> {
    return apiClient.post<SessionDto>(API_ROUTES.SESSIONS.CREATE, data, {
      auth: false,
    });
  },

  get(id: string): Promise<SessionDto> {
    return apiClient.get<SessionDto>(API_ROUTES.SESSIONS.byId(id), {
      auth: false,
    });
  },

  getByCode(code: string): Promise<SessionDto> {
    return apiClient.get<SessionDto>(API_ROUTES.SESSIONS.byCode(code), {
      auth: false,
    });
  },
};
