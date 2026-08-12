export function getApiBaseUrl(): string {
  const value = process.env.NEXT_PUBLIC_API_URL;
  if (!value) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_API_URL");
  }
  return value.replace(/\/$/, "");
}

export function getApiV1BaseUrl(): string {
  return `${getApiBaseUrl()}/api/v1`;
}
