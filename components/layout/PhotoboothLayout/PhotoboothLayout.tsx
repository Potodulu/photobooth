import { cn } from "@/libs/cn";
import { Link } from "@/i18n/navigation";

export function PhotoboothLayout({
  children,
  title,
  subtitle,
  className,
  immersive = false,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  /** Full-viewport camera shell: no scroll, compact chrome, safe areas. */
  immersive?: boolean;
}) {
  if (immersive) {
    return (
      <div
        className={cn(
          "bg-background flex h-dvh max-h-dvh flex-col overflow-hidden",
          className,
        )}
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        <header className="border-border flex shrink-0 items-center justify-between border-b px-4 py-2 sm:px-5">
          <Link
            href="/"
            className="font-display text-lg font-extrabold tracking-tight"
          >
            Potodulu
          </Link>
        </header>
        <main className="relative flex min-h-0 flex-1 flex-col">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className={cn("bg-background flex min-h-dvh flex-col", className)}>
      <header className="border-border flex items-center border-b-2 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-xl font-extrabold tracking-tight"
        >
          Potodulu
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
        {(title || subtitle) && (
          <div className="space-y-2">
            {title ? (
              <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                {title}
              </h1>
            ) : null}
            {subtitle ? (
              <p className="text-muted-foreground max-w-2xl text-base">
                {subtitle}
              </p>
            ) : null}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
