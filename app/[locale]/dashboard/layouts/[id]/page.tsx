import { resolveLocaleParams } from "@/i18n/resolveLocaleParams";
import { LayoutDetailPage } from "@/components/page/LayoutDetailPage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await resolveLocaleParams(params);
  return <LayoutDetailPage id={id} />;
}
