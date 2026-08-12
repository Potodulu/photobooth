import { resolveLocaleParams } from "@/i18n/resolveLocaleParams";
import { RegisterPage } from "@/components/page/RegisterPage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await resolveLocaleParams(params);
  return <RegisterPage />;
}
