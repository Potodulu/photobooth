"use client";

import { useTranslations } from "next-intl";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { ErrorIllustration } from "@/components/shared/ErrorIllustration";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

export function NotFoundPage() {
  const t = useTranslations("Errors.notFound");

  return (
    <MarketingLayout className="items-center justify-center gap-6 px-4 py-24 text-center">
      <ErrorIllustration variant="not-found" />
      <div className="space-y-2">
        <p className="font-display text-primary text-5xl font-extrabold">
          {t("code")}
        </p>
        <h1 className="font-display text-3xl font-extrabold">{t("title")}</h1>
        <p className="text-muted-foreground max-w-md">{t("description")}</p>
      </div>
      <Button
        asChild
        variant="solid"
        color="primary"
        radius="lg"
        elevation="md"
      >
        <Link href="/">{t("action")}</Link>
      </Button>
    </MarketingLayout>
  );
}
