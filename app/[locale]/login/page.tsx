import { resolveLocaleParams } from "@/i18n/resolveLocaleParams";
import { LoginPage } from "@/components/page/LoginPage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await resolveLocaleParams(params);
  return <LoginPage />;
}
