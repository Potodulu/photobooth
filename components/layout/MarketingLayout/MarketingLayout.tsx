import { cn } from "@/libs/cn";

export function MarketingLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-h-dvh flex-col", className)}>{children}</div>
  );
}
