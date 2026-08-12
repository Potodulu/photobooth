import { resolveLocaleParams } from "@/i18n/resolveLocaleParams";
import { FrameEditPage } from "@/components/page/FrameEditPage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await resolveLocaleParams(params);
  return <FrameEditPage id={id} />;
}
