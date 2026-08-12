import { setRequestLocale } from "next-intl/server";

export async function resolveLocaleParams<T extends { locale: string }>(
  params: Promise<T>,
): Promise<T> {
  const resolved = await params;
  setRequestLocale(resolved.locale);
  return resolved;
}
