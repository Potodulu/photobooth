import { resolveLocaleParams } from "@/i18n/resolveLocaleParams";
import { ProfilePage } from "@/components/page/ProfilePage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await resolveLocaleParams(params);
  return <ProfilePage />;
}
