import { resolveLocaleParams } from "@/i18n/resolveLocaleParams";
import { FrameDetailPage } from "@/components/page/FrameDetailPage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await resolveLocaleParams(params);
  return <FrameDetailPage id={id} />;
}
