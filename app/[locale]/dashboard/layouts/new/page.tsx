import { resolveLocaleParams } from "@/i18n/resolveLocaleParams";
import { LayoutCreatePage } from "@/components/page/LayoutCreatePage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await resolveLocaleParams(params);
  return <LayoutCreatePage />;
}
