import { resolveLocaleParams } from "@/i18n/resolveLocaleParams";
import { FrameCreatePage } from "@/components/page/FrameCreatePage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await resolveLocaleParams(params);
  return <FrameCreatePage />;
}
