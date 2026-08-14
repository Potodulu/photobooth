import { resolveLocaleParams } from "@/i18n/resolveLocaleParams";
import { UserAccessPage } from "@/components/page/UserAccessPage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await resolveLocaleParams(params);
  return <UserAccessPage />;
}
