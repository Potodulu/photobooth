import { setRequestLocale } from "next-intl/server";
import { LayoutListPage } from "@/components/page/LayoutListPage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LayoutListPage />;
}
