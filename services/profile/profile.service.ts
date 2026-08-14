import { API_ROUTES } from "@/constants/apiRoute";
import { apiClient } from "@/libs/api";
import type {
  ProfileDto,
  UpdateProfilePayload,
  UpdateEmailPayload,
  ChangePasswordPayload,
  UserAccountDto,
} from "@/types";

export const profileService = {
  get(): Promise<ProfileDto> {
    return apiClient.get<ProfileDto>(API_ROUTES.PROFILES.ME);
  },

  update(data: UpdateProfilePayload): Promise<ProfileDto> {
    return apiClient.patch<ProfileDto>(API_ROUTES.PROFILES.ME, data);
  },

  updateEmail(data: UpdateEmailPayload): Promise<UserAccountDto> {
    return apiClient.patch<UserAccountDto>(
      API_ROUTES.PROFILES.UPDATE_EMAIL,
      data,
    );
  },

  changePassword(data: ChangePasswordPayload): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(
      API_ROUTES.PROFILES.CHANGE_PASSWORD,
      data,
    );
  },
};
