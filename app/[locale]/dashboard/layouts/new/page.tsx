import { setRequestLocale } from "next-intl/server";
import { LayoutCreatePage } from "@/components/page/LayoutCreatePage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LayoutCreatePage />;
}
