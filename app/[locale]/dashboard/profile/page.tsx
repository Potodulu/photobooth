import { setRequestLocale } from "next-intl/server";
import { ProfilePage } from "@/components/page/ProfilePage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProfilePage />;
}
