import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/libs/cn";

export function SiteHeader({
  ctaLabel,
  className,
}: {
  ctaLabel: string;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "border-border bg-background/90 sticky top-0 z-40 border-b-2 backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-xl font-extrabold tracking-tight"
        >
          {siteConfig.name}
        </Link>
        <Button asChild variant="solid" color="primary" size="sm" radius="lg">
          <Link href="#cta">{ctaLabel}</Link>
        </Button>
      </div>
    </header>
  );
}
