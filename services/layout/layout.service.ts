import { API_ROUTES } from "@/constants/apiRoute";
import {
  apiClient,
  type ApiPaginatedData,
  type ListParams,
  type PaginatedResponse,
} from "@/libs/api";
import type {
  CreateLayoutPayload,
  LayoutDto,
  UpdateLayoutPayload,
} from "@/types";

function normalizeList(
  response:
    ApiPaginatedData<LayoutDto> | LayoutDto[] | PaginatedResponse<LayoutDto>,
): PaginatedResponse<LayoutDto> {
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

export const layoutService = {
  async list(params?: ListParams): Promise<PaginatedResponse<LayoutDto>> {
    const search = new URLSearchParams();
    if (params?.page != null) search.set("page", String(params.page));
    if (params?.per_page != null)
      search.set("per_page", String(params.per_page));
    if (params?.search) search.set("search", params.search);
    const qs = search.toString();
    const path = qs
      ? `${API_ROUTES.LAYOUTS.LIST}?${qs}`
      : API_ROUTES.LAYOUTS.LIST;
    const response = await apiClient.get<
      ApiPaginatedData<LayoutDto> | LayoutDto[]
    >(path);
    return normalizeList(response);
  },

  get(id: string): Promise<LayoutDto> {
    return apiClient.get<LayoutDto>(API_ROUTES.LAYOUTS.byId(id));
  },

  create(data: CreateLayoutPayload): Promise<LayoutDto> {
    return apiClient.post<LayoutDto>(API_ROUTES.LAYOUTS.LIST, data);
  },

  update(id: string, data: UpdateLayoutPayload): Promise<LayoutDto> {
    return apiClient.put<LayoutDto>(API_ROUTES.LAYOUTS.byId(id), data);
  },

  delete(id: string): Promise<void> {
    return apiClient.delete<void>(API_ROUTES.LAYOUTS.byId(id));
  },

  uploadPreview(id: string, file: File): Promise<LayoutDto> {
    const form = new FormData();
    form.append("file", file);
    const api = apiClient.post<LayoutDto>(API_ROUTES.LAYOUTS.preview(id), form);
    console.log({ api: Promise.resolve(api) });
    return api;
  },
};
