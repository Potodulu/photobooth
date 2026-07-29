import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/libs/cn";
import { radiusClasses } from "@/libs/configs/variants";

const badgeVariants = cva(
  "inline-flex items-center justify-center border-2 border-border font-semibold whitespace-nowrap",
  {
    variants: {
      variant: {
        solid: "",
        soft: "",
        outline: "bg-transparent",
      },
      color: {
        primary: "",
        secondary: "",
        accent: "",
        destructive: "",
        success: "",
        warning: "",
        neutral: "",
      },
      size: {
        sm: "h-5 px-2 text-xs gap-1",
        md: "h-6 px-2.5 text-xs gap-1",
        lg: "h-7 px-3 text-sm gap-1.5",
      },
      radius: radiusClasses,
    },
    compoundVariants: [
      {
        variant: "solid",
        color: "primary",
        class: "bg-primary text-primary-foreground",
      },
      {
        variant: "solid",
        color: "secondary",
        class: "bg-secondary text-secondary-foreground",
      },
      {
        variant: "solid",
        color: "accent",
        class: "bg-accent text-accent-foreground",
      },
      {
        variant: "solid",
        color: "destructive",
        class: "bg-destructive text-destructive-foreground",
      },
      {
        variant: "solid",
        color: "success",
        class: "bg-success text-success-foreground",
      },
      {
        variant: "solid",
        color: "warning",
        class: "bg-warning text-warning-foreground",
      },
      {
        variant: "solid",
        color: "neutral",
        class: "bg-foreground text-background",
      },
      {
        variant: "soft",
        color: "primary",
        class: "bg-primary/30 text-primary-foreground",
      },
      {
        variant: "soft",
        color: "secondary",
        class: "bg-secondary/30 text-secondary-foreground",
      },
      {
        variant: "soft",
        color: "accent",
        class: "bg-accent/40 text-accent-foreground",
      },
      {
        variant: "soft",
        color: "destructive",
        class: "bg-destructive/25 text-destructive-foreground",
      },
      {
        variant: "soft",
        color: "success",
        class: "bg-success/30 text-success-foreground",
      },
      {
        variant: "soft",
        color: "warning",
        class: "bg-warning/30 text-warning-foreground",
      },
      {
        variant: "soft",
        color: "neutral",
        class: "bg-muted text-foreground",
      },
      {
        variant: "outline",
        color: "primary",
        class: "text-primary-foreground bg-background",
      },
      {
        variant: "outline",
        color: "secondary",
        class: "text-secondary-foreground bg-background",
      },
      {
        variant: "outline",
        color: "accent",
        class: "text-accent-foreground bg-background",
      },
      {
        variant: "outline",
        color: "destructive",
        class: "text-destructive-foreground bg-background",
      },
      {
        variant: "outline",
        color: "success",
        class: "text-success-foreground bg-background",
      },
      {
        variant: "outline",
        color: "warning",
        class: "text-warning-foreground bg-background",
      },
      {
        variant: "outline",
        color: "neutral",
        class: "text-foreground bg-background",
      },
    ],
    defaultVariants: {
      variant: "soft",
      color: "neutral",
      size: "md",
      radius: "md",
    },
  },
);

export interface BadgeProps
  extends
    Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof badgeVariants> {}

function Badge({
  className,
  variant,
  color,
  size,
  radius,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, color, size, radius }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
