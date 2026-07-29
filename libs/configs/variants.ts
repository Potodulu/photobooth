export const radiusClasses = {
  none: "rounded-none",
  sm: "rounded-[var(--radius-sm)]",
  md: "rounded-[var(--radius-md)]",
  lg: "rounded-[var(--radius-lg)]",
  xl: "rounded-[var(--radius-xl)]",
  full: "rounded-full",
} as const;

export const elevationClasses = {
  none: "shadow-none",
  sm: "shadow-neo-sm",
  md: "shadow-neo-md",
  lg: "shadow-neo-lg",
} as const;

export const sizeClasses = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-5 text-base gap-2",
  xl: "h-14 px-6 text-lg gap-2.5",
} as const;

export type Radius = keyof typeof radiusClasses;
export type Elevation = keyof typeof elevationClasses;
export type Size = keyof typeof sizeClasses;
export type Color =
  | "primary"
  | "secondary"
  | "accent"
  | "destructive"
  | "success"
  | "warning"
  | "neutral";

export type Variant = "solid" | "soft" | "outline" | "ghost" | "link";
