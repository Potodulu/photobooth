import { resolveLocaleParams } from "@/i18n/resolveLocaleParams";
import { DashboardHomePage } from "@/components/page/DashboardHomePage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await resolveLocaleParams(params);
  return <DashboardHomePage />;
}
