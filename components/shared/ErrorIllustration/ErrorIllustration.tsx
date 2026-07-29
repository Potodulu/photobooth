"use client";

import { cn } from "@/libs/cn";

type ErrorIllustrationVariant = "not-found" | "error" | "maintenance";

const COLORS: Record<
  ErrorIllustrationVariant,
  { fill: string; accent: string }
> = {
  "not-found": { fill: "#7ec8b8", accent: "#f5d76e" },
  error: { fill: "#f07167", accent: "#8ec5e8" },
  maintenance: { fill: "#8ec5e8", accent: "#f5d76e" },
};

type ErrorIllustrationProps = {
  variant: ErrorIllustrationVariant;
  className?: string;
};

export function ErrorIllustration({
  variant,
  className,
}: ErrorIllustrationProps) {
  const { fill, accent } = COLORS[variant];

  return (
    <svg
      viewBox="0 0 240 180"
      className={cn("mx-auto w-full max-w-xs", className)}
      aria-hidden
    >
      <rect
        x="24"
        y="28"
        width="192"
        height="124"
        rx="16"
        fill={fill}
        stroke="#1a1a1a"
        strokeWidth="4"
      />
      <rect
        x="48"
        y="52"
        width="144"
        height="76"
        rx="10"
        fill="#f7f4ef"
        stroke="#1a1a1a"
        strokeWidth="3"
      />
      <circle
        cx="88"
        cy="88"
        r="10"
        fill={accent}
        stroke="#1a1a1a"
        strokeWidth="2"
      />
      <circle
        cx="152"
        cy="88"
        r="10"
        fill={accent}
        stroke="#1a1a1a"
        strokeWidth="2"
      />
      <path
        d="M96 118c12 12 36 12 48 0"
        fill="none"
        stroke="#1a1a1a"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect
        x="168"
        y="12"
        width="36"
        height="28"
        rx="6"
        fill={accent}
        stroke="#1a1a1a"
        strokeWidth="3"
        transform="rotate(12 186 26)"
      />
    </svg>
  );
}
