import { API_ROUTES } from "@/constants/apiRoute";
import { apiClient } from "@/libs/api";
import type { AssetDto } from "@/types";

export const assetService = {
  get(id: string): Promise<AssetDto> {
    return apiClient.get<AssetDto>(API_ROUTES.ASSETS.byId(id));
  },

  async download(id: string): Promise<Blob> {
    return apiClient.download(API_ROUTES.ASSETS.download(id));
  },

  async getObjectUrl(id: string): Promise<string> {
    const blob = await this.download(id);
    return URL.createObjectURL(blob);
  },

  delete(id: string): Promise<void> {
    return apiClient.delete<void>(API_ROUTES.ASSETS.byId(id));
  },
};
