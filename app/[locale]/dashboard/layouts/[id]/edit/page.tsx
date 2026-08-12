import { resolveLocaleParams } from "@/i18n/resolveLocaleParams";
import { LayoutEditPage } from "@/components/page/LayoutEditPage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await resolveLocaleParams(params);
  return <LayoutEditPage id={id} />;
}
