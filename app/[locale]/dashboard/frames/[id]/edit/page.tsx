import { setRequestLocale } from "next-intl/server";
import { FrameEditPage } from "@/components/page/FrameEditPage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <FrameEditPage id={id} />;
}
