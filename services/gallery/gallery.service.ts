import { API_ROUTES } from "@/constants/apiRoute";
import { apiClient } from "@/libs/api";
import type { GalleryResponseDto } from "@/types";

export const galleryService = {
  getBySessionId(sessionId: string): Promise<GalleryResponseDto> {
    return apiClient.get<GalleryResponseDto>(
      API_ROUTES.GALLERY.bySessionId(sessionId),
      { auth: false },
    );
  },
};
