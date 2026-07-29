import { cn } from "@/libs/cn";
import { Link } from "@/i18n/navigation";

export function PhotoboothLayout({
  children,
  title,
  subtitle,
  className,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("bg-background flex min-h-dvh flex-col", className)}>
      <header className="border-border flex items-center justify-between border-b-2 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-xl font-extrabold tracking-tight"
        >
          Potodulu
        </Link>
        <span className="text-muted-foreground text-sm">Try Now</span>
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
