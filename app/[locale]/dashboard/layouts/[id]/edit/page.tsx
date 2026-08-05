import { setRequestLocale } from "next-intl/server";
import { LayoutEditPage } from "@/components/page/LayoutEditPage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <LayoutEditPage id={id} />;
}
