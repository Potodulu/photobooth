import type { ApiErrorBody, ApiErrorDetail } from "./types";

export class ApiError extends Error {
  status: number;
  body: ApiErrorBody | null;
  code?: string;

  constructor(
    message: string,
    status: number,
    body: ApiErrorBody | null = null,
    code?: string,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
    this.code = code;
  }
}

function extractErrorDetail(body: ApiErrorBody | null): {
  message?: string;
  code?: string;
} {
  if (!body) return {};

  if (body.error && typeof body.error === "object") {
    const detail = body.error as ApiErrorDetail;
    return {
      message: detail.message,
      code: detail.code,
    };
  }

  if (typeof body.error === "string" && body.error.trim()) {
    return { message: body.error, code: body.code };
  }

  if (typeof body.message === "string" && body.message.trim()) {
    return { message: body.message, code: body.code };
  }

  if (typeof body.detail === "string" && body.detail.trim()) {
    return { message: body.detail, code: body.code };
  }

  if (Array.isArray(body.detail) && body.detail.length > 0) {
    const first = body.detail[0];
    if (first?.msg) return { message: first.msg, code: body.code };
  }

  return { code: body.code };
}

export function parseApiErrorMessage(
  body: ApiErrorBody | null,
  fallback = "Terjadi kesalahan. Coba lagi ya.",
): string {
  const { message } = extractErrorDetail(body);
  return message?.trim() || fallback;
}

export function parseApiErrorCode(
  body: ApiErrorBody | null,
): string | undefined {
  return extractErrorDetail(body).code;
}

export function toApiError(
  status: number,
  body: ApiErrorBody | null,
): ApiError {
  return new ApiError(
    parseApiErrorMessage(body),
    status,
    body,
    parseApiErrorCode(body),
  );
}
