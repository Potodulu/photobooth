"use client";

import { useTranslations } from "next-intl";
import {
  Camera,
  Clapperboard,
  Frame,
  Globe,
  Share2,
  Sparkles,
  Store,
  Users,
  Wand2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { cn } from "@/libs/cn";
import { ROUTES } from "@/constants/route";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export function HomePage() {
  const tNav = useTranslations("Nav");
  const tFooter = useTranslations("Footer");
  const tHero = useTranslations("Hero");
  const tFeatures = useTranslations("Features");
  const tExperience = useTranslations("Experience");
  const tCta = useTranslations("Cta");

  const heroBadges = ["online", "browser", "noAccount", "instant"] as const;

  const features = [
    { key: "capture" as const, icon: Camera, color: "primary" as const },
    { key: "frame" as const, icon: Frame, color: "secondary" as const },
    { key: "livePhoto" as const, icon: Clapperboard, color: "accent" as const },
    { key: "filters" as const, icon: Wand2, color: "primary" as const },
    { key: "output" as const, icon: Share2, color: "secondary" as const },
  ];

  const experiences = [
    {
      key: "onlineSingle" as const,
      icon: Globe,
      color: "primary" as const,
      status: "available" as const,
      href: ROUTES.ONLINE.ROOT,
    },
    {
      key: "offline" as const,
      icon: Store,
      color: "secondary" as const,
      status: "soon" as const,
    },
    {
      key: "remoteGroup" as const,
      icon: Users,
      color: "accent" as const,
      status: "soon" as const,
    },
  ] as const;

  return (
    <MarketingLayout>
      <SiteHeader ctaLabel={tNav("cta")} ctaHref={ROUTES.ONLINE.ROOT} />

      <main>
        <section className="border-border relative overflow-hidden border-b-2">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--primary)_0%,_transparent_55%),radial-gradient(ellipse_at_bottom_left,_var(--accent)_0%,_transparent_45%)] opacity-35"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,transparent_0,transparent_calc(100%-1px),color-mix(in_oklab,var(--border)_10%,transparent)_calc(100%-1px)),linear-gradient(to_bottom,transparent_0,transparent_calc(100%-1px),color-mix(in_oklab,var(--border)_10%,transparent)_calc(100%-1px))] bg-size-[48px_48px]"
          />

          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
            <motion.div
              initial="hidden"
              animate="show"
              transition={{ staggerChildren: 0.12 }}
              className="flex flex-col gap-6"
            >
              <motion.div variants={fadeUp} className="space-y-2">
                <p className="text-primary text-sm font-semibold tracking-wide">
                  {tHero("eyebrow")}
                </p>
                <p className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                  {tHero("brand")}
                </p>
              </motion.div>
              <motion.h1
                variants={fadeUp}
                className="text-foreground max-w-xl text-2xl leading-snug font-semibold sm:text-3xl"
              >
                {tHero("headline")}
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="text-muted-foreground max-w-lg text-base leading-relaxed sm:text-lg"
              >
                {tHero("supporting")}
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
                {heroBadges.map((key) => (
                  <Badge
                    key={key}
                    variant="soft"
                    color={key === "online" ? "primary" : "neutral"}
                    radius="full"
                    size="sm"
                  >
                    {tHero(`badges.${key}`)}
                  </Badge>
                ))}
              </motion.div>
              <motion.div
                variants={fadeUp}
                className="flex flex-wrap items-center gap-3 pt-2"
              >
                <Button
                  asChild
                  variant="solid"
                  color="primary"
                  size="lg"
                  radius="xl"
                  elevation="lg"
                >
                  <Link href={ROUTES.ONLINE.ROOT}>{tHero("primaryCta")}</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  color="neutral"
                  size="lg"
                  radius="xl"
                  elevation="md"
                >
                  <Link href="#features">{tHero("secondaryCta")}</Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.15 }}
              className="relative"
            >
              <div className="border-border bg-card shadow-neo-lg aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-xl)] border-2">
                <div className="flex h-full flex-col justify-between bg-[linear-gradient(165deg,_var(--card)_0%,_color-mix(in_oklab,var(--primary)_18%,var(--card))_100%)] p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-3">
                    <Badge
                      variant="solid"
                      color="primary"
                      size="md"
                      radius="full"
                    >
                      {tHero("preview.badge")}
                    </Badge>
                    <Sparkles className="text-accent size-5" aria-hidden />
                  </div>

                  <div className="border-border bg-background/80 shadow-neo-md mx-auto w-full max-w-[220px] rounded-[var(--radius-lg)] border-2 p-3">
                    <div className="bg-muted mb-2 aspect-[3/4] rounded-[var(--radius-md)]" />
                    <div className="grid grid-cols-3 gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="border-border bg-muted/60 aspect-square rounded-[var(--radius-sm)] border"
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-muted-foreground text-center text-sm font-medium">
                    {tHero("preview.tagline")}
                  </p>
                </div>
              </div>
              <div className="border-border bg-accent text-accent-foreground font-display shadow-neo-md absolute -bottom-4 -left-4 hidden rotate-[-3deg] rounded-[var(--radius-lg)] border-2 px-4 py-2 text-sm font-bold sm:block">
                {tHero("preview.sticker")}
              </div>
            </motion.div>
          </div>
        </section>

        <section
          id="features"
          className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24"
        >
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ staggerChildren: 0.1 }}
            className="mb-12 max-w-2xl space-y-3"
          >
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl"
            >
              {tFeatures("title")}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-muted-foreground text-base sm:text-lg"
            >
              {tFeatures("subtitle")}
            </motion.p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ key, icon: Icon, color }, index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.08 }}
              >
                <Card
                  color={color === "accent" ? "accent" : "default"}
                  radius="xl"
                  elevation="md"
                  className="h-full"
                >
                  <CardHeader>
                    <div className="border-border bg-background shadow-neo-sm mb-3 inline-flex size-12 items-center justify-center rounded-[var(--radius-md)] border-2">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle>{tFeatures(`items.${key}.title`)}</CardTitle>
                    <CardDescription>
                      {tFeatures(`items.${key}.description`)}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="border-border bg-muted/30 border-y-2 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-12 max-w-2xl space-y-3">
              <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                {tExperience("title")}
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg">
                {tExperience("subtitle")}
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {experiences.map(
                ({ key, icon: Icon, color, status, ...rest }) => (
                  <Card
                    key={key}
                    radius="xl"
                    elevation={status === "available" ? "lg" : "sm"}
                    color={color}
                    className={cn(
                      "h-full transition-opacity",
                      status === "soon" && "opacity-75",
                    )}
                  >
                    <CardHeader className="flex h-full flex-col gap-4">
                      <div className="flex items-center justify-between gap-3">
                        <div
                          className={cn(
                            "border-border bg-background shadow-neo-sm inline-flex size-11 items-center justify-center rounded-[var(--radius-md)] border-2",
                            status === "soon" && "opacity-70",
                          )}
                        >
                          <Icon className="size-5" />
                        </div>
                        <Badge
                          variant={status === "available" ? "solid" : "outline"}
                          color={status === "available" ? "success" : "neutral"}
                          radius="full"
                          size="sm"
                        >
                          {tExperience(status)}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <CardTitle>{tExperience(`${key}.title`)}</CardTitle>
                        <CardDescription>
                          {tExperience(`${key}.description`)}
                        </CardDescription>
                      </div>
                      {status === "available" && "href" in rest && (
                        <Button
                          asChild
                          variant="solid"
                          color="primary"
                          size="md"
                          radius="lg"
                          elevation="md"
                          className="mt-auto w-full sm:w-auto"
                        >
                          <Link href={rest.href}>
                            {tExperience("startSession")}
                          </Link>
                        </Button>
                      )}
                    </CardHeader>
                  </Card>
                ),
              )}
            </div>
          </div>
        </section>

        <section
          id="cta"
          className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border-border bg-card shadow-neo-lg relative overflow-hidden rounded-[var(--radius-xl)] border-2 p-8 sm:p-12"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_color-mix(in_oklab,var(--primary)_20%,transparent)_0%,_transparent_60%)]"
            />
            <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl space-y-3">
                <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {tCta("title")}
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg">
                  {tCta("subtitle")}
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  asChild
                  variant="solid"
                  color="accent"
                  size="xl"
                  radius="xl"
                  elevation="lg"
                >
                  <Link href={ROUTES.ONLINE.ROOT}>{tCta("button")}</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>

      <SiteFooter tagline={tFooter("tagline")} />
    </MarketingLayout>
  );
}
