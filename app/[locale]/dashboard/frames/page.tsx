import { setRequestLocale } from "next-intl/server";
import { FrameListPage } from "@/components/page/FrameListPage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <FrameListPage />;
}
