"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/libs/cn";
import { elevationClasses, radiusClasses } from "@/libs/configs/variants";

const progressVariants = cva(
  "relative w-full overflow-hidden border-2 border-border bg-muted",
  {
    variants: {
      size: {
        sm: "h-2",
        md: "h-3",
        lg: "h-4",
      },
      radius: radiusClasses,
      elevation: elevationClasses,
    },
    defaultVariants: {
      size: "md",
      radius: "full",
      elevation: "none",
    },
  },
);

const progressIndicatorVariants = cva(
  "size-full transition-all duration-300 ease-out",
  {
    variants: {
      color: {
        primary: "bg-primary",
        secondary: "bg-secondary",
        accent: "bg-accent",
        destructive: "bg-destructive",
        success: "bg-success",
        warning: "bg-warning",
        neutral: "bg-foreground",
      },
    },
    defaultVariants: {
      color: "primary",
    },
  },
);

export interface ProgressProps
  extends
    Omit<
      React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
      "color"
    >,
    VariantProps<typeof progressVariants>,
    VariantProps<typeof progressIndicatorVariants> {}

const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, size, radius, elevation, color, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(progressVariants({ size, radius, elevation }), className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={progressIndicatorVariants({ color })}
      style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress, progressVariants };
