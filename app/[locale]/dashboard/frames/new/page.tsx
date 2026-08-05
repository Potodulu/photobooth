import { setRequestLocale } from "next-intl/server";
import { FrameCreatePage } from "@/components/page/FrameCreatePage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <FrameCreatePage />;
}
