import { resolveLocaleParams } from "@/i18n/resolveLocaleParams";
import { LayoutListPage } from "@/components/page/LayoutListPage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await resolveLocaleParams(params);
  return <LayoutListPage />;
}
