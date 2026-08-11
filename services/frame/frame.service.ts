import { API_ROUTES, type FrameAssetKind } from "@/constants/apiRoute";
import {
  apiClient,
  type ApiPaginatedData,
  type ListParams,
  type PaginatedResponse,
} from "@/libs/api";
import type { CreateFramePayload, FrameDto, UpdateFramePayload } from "@/types";

function normalizeList(
  response:
    ApiPaginatedData<FrameDto> | FrameDto[] | PaginatedResponse<FrameDto>,
): PaginatedResponse<FrameDto> {
  if (Array.isArray(response)) {
    return { data: response, meta: { total: response.length } };
  }
  if ("items" in response) {
    return { data: response.items ?? [], meta: response.meta };
  }
  if ("data" in response) {
    return { data: response.data ?? [], meta: response.meta };
  }
  return { data: [], meta: {} };
}

export const frameService = {
  async list(params?: ListParams): Promise<PaginatedResponse<FrameDto>> {
    const search = new URLSearchParams();
    if (params?.page != null) search.set("page", String(params.page));
    if (params?.per_page != null)
      search.set("per_page", String(params.per_page));
    if (params?.search) search.set("search", params.search);
    const qs = search.toString();
    const path = qs
      ? `${API_ROUTES.FRAMES.LIST}?${qs}`
      : API_ROUTES.FRAMES.LIST;
    const response = await apiClient.get<
      ApiPaginatedData<FrameDto> | FrameDto[]
    >(path);
    return normalizeList(response);
  },

  get(id: string): Promise<FrameDto> {
    return apiClient.get<FrameDto>(API_ROUTES.FRAMES.byId(id));
  },

  create(data: CreateFramePayload): Promise<FrameDto> {
    return apiClient.post<FrameDto>(API_ROUTES.FRAMES.LIST, data);
  },

  update(id: string, data: UpdateFramePayload): Promise<FrameDto> {
    return apiClient.put<FrameDto>(API_ROUTES.FRAMES.byId(id), data);
  },

  delete(id: string): Promise<void> {
    return apiClient.delete<void>(API_ROUTES.FRAMES.byId(id));
  },

  uploadAsset(id: string, kind: FrameAssetKind, file: File): Promise<FrameDto> {
    const form = new FormData();
    form.append("file", file);
    return apiClient.post<FrameDto>(API_ROUTES.FRAMES.asset(id, kind), form);
  },

  downloadOverlayPath(id: string, sessionId?: string): string {
    const path = API_ROUTES.FRAMES.downloadOverlay(id);
    if (!sessionId) return path;
    const search = new URLSearchParams({ session_id: sessionId });
    return `${path}?${search.toString()}`;
  },
};
