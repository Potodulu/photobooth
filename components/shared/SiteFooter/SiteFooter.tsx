import { siteConfig } from "@/config/site";
import { cn } from "@/libs/cn";

export function SiteFooter({
  tagline,
  className,
}: {
  tagline: string;
  className?: string;
}) {
  return (
    <footer
      className={cn(
        "border-border bg-muted/40 mt-auto border-t-2 py-10",
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 sm:px-6">
        <p className="font-display text-lg font-extrabold">{siteConfig.name}</p>
        <p className="text-muted-foreground text-sm">{tagline}</p>
      </div>
    </footer>
  );
}
