import { setRequestLocale } from "next-intl/server";
import { RegisterPage } from "@/components/page/RegisterPage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <RegisterPage />;
}
