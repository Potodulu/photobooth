export type ListParams = {
  page?: number;
  per_page?: number;
  search?: string;
};

export type PaginationMeta = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
};

/** Shape inside `data` after envelope unwrap for list endpoints. */
export type ApiPaginatedData<T> = {
  items: T[];
  meta: PaginationMeta;
};

/** UI/service list result — `data` mapped from BE `items`. */
export type PaginatedResponse<T> = {
  data: T[];
  meta?: Partial<PaginationMeta>;
};

export type ApiSuccessEnvelope<T> = {
  success: true;
  data: T;
};

export type ApiErrorDetail = {
  code: string;
  message: string;
};

export type ApiErrorEnvelope = {
  success: false;
  error: ApiErrorDetail;
};

export type ApiEnvelope<T> = ApiSuccessEnvelope<T> | ApiErrorEnvelope;

/** Legacy / loose error body used while parsing. */
export type ApiErrorBody = {
  message?: string;
  detail?: string | { msg?: string }[];
  error?: string | ApiErrorDetail;
  success?: boolean;
  code?: string;
};
