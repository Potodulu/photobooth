import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { resolveLocaleParams } from "@/i18n/resolveLocaleParams";
import { HomePage } from "@/components/page/HomePage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await resolveLocaleParams(params);
  return <HomePage />;
}
