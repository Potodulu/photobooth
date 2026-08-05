import { toApiError } from "./errors";
import type { ApiEnvelope, ApiErrorBody } from "./types";

function isEnvelope(value: unknown): value is ApiEnvelope<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    typeof (value as { success: unknown }).success === "boolean"
  );
}

/**
 * Unwrap BE response envelope `{ success, data }` / `{ success: false, error }`.
 * Returns `data` on success. Throws ApiError on failure envelope or invalid shape.
 */
export function unwrapEnvelope<T>(parsed: unknown, httpStatus: number): T {
  if (parsed === null || parsed === undefined) {
    return undefined as T;
  }

  if (!isEnvelope(parsed)) {
    // Non-envelope JSON (rare) — pass through for resilience.
    return parsed as T;
  }

  if (parsed.success === false) {
    throw toApiError(httpStatus || 400, parsed as ApiErrorBody);
  }

  return parsed.data as T;
}

export function throwIfErrorEnvelope(
  parsed: unknown,
  httpStatus: number,
): never {
  if (isEnvelope(parsed) && parsed.success === false) {
    throw toApiError(httpStatus, parsed as ApiErrorBody);
  }
  throw toApiError(httpStatus, (parsed as ApiErrorBody) ?? null);
}

export function unwrapEnvelopeOrThrow<T>(
  parsed: unknown,
  httpStatus: number,
): T {
  if (httpStatus >= 400) {
    throwIfErrorEnvelope(parsed, httpStatus);
  }

  return unwrapEnvelope<T>(parsed, httpStatus);
}

export function isApiErrorEnvelope(value: unknown): boolean {
  return isEnvelope(value) && value.success === false;
}
