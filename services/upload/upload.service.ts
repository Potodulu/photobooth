import { API_ROUTES } from "@/constants/apiRoute";
import { apiClient } from "@/libs/api";
import type { SessionAssetDto } from "@/types";

export const uploadService = {
  uploadAsset(sessionId: string, file: File): Promise<SessionAssetDto> {
    const form = new FormData();
    form.append("file", file);
    return apiClient.post<SessionAssetDto>(
      API_ROUTES.UPLOADS.assets(sessionId),
      form,
      { auth: false },
    );
  },

  uploadResult(sessionId: string, file: File): Promise<SessionAssetDto> {
    const form = new FormData();
    form.append("file", file);
    return apiClient.post<SessionAssetDto>(
      API_ROUTES.UPLOADS.results(sessionId),
      form,
      { auth: false },
    );
  },
};
