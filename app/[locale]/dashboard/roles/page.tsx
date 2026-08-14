import { resolveLocaleParams } from "@/i18n/resolveLocaleParams";
import { RolePage } from "@/components/page/RolePage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await resolveLocaleParams(params);
  return <RolePage />;
}
