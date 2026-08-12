import { API_ROUTES } from "@/constants/apiRoute";
import { apiClient } from "@/libs/api";
import type { ProfileDto, UpdateProfilePayload } from "@/types";

export const profileService = {
  get(): Promise<ProfileDto> {
    return apiClient.get<ProfileDto>(API_ROUTES.PROFILES.ME);
  },

  update(data: UpdateProfilePayload): Promise<ProfileDto> {
    return apiClient.patch<ProfileDto>(API_ROUTES.PROFILES.ME, data);
  },
};
