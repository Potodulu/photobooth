import { resolveLocaleParams } from "@/i18n/resolveLocaleParams";
import { FrameListPage } from "@/components/page/FrameListPage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await resolveLocaleParams(params);
  return <FrameListPage />;
}
