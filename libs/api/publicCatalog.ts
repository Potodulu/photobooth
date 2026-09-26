import { getApiV1BaseUrl } from "@/libs/config/env";

/** Booth guest catalog: layout and frame public endpoints (no auth). */
export function isPublicCatalogApiPath(pathOrUrl: string): boolean {
  let pathname = pathOrUrl;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    try {
      pathname = new URL(pathOrUrl).pathname;
    } catch {
      return false;
    }
  } else {
    const queryIndex = pathname.indexOf("?");
    if (queryIndex >= 0) pathname = pathname.slice(0, queryIndex);
  }

  if (!pathname.startsWith("/")) pathname = `/${pathname}`;

  return (
    pathname.startsWith("/layouts") ||
    pathname.startsWith("/frames")
  );
}

export function resolveApiV1RelativePath(absoluteUrl: string): string | null {
  try {
    const base = new URL(getApiV1BaseUrl());
    const target = new URL(absoluteUrl);
    if (target.origin !== base.origin) return null;

    const basePath = base.pathname.replace(/\/$/, "") || "";
    const targetPath = target.pathname;
    if (!targetPath.startsWith(basePath)) return null;

    const relativePath = targetPath.slice(basePath.length);
    const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
    return `${path}${target.search}`;
  } catch {
    return null;
  }
}
