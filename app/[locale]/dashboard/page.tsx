import { setRequestLocale } from "next-intl/server";
import { DashboardHomePage } from "@/components/page/DashboardHomePage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <DashboardHomePage />;
}
