"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/libs/cn";
import { radiusClasses } from "@/libs/configs/variants";

const switchVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center border-2 border-border shadow-neo-sm transition-[background-color,transform,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:shadow-none data-[state=checked]:translate-x-px data-[state=checked]:translate-y-px",
  {
    variants: {
      size: {
        sm: "h-5 w-9",
        md: "h-6 w-11",
        lg: "h-7 w-[3.25rem]",
      },
      color: {
        primary: "data-[state=checked]:bg-primary focus-visible:ring-primary",
        secondary:
          "data-[state=checked]:bg-secondary focus-visible:ring-secondary",
        accent: "data-[state=checked]:bg-accent focus-visible:ring-accent",
        destructive:
          "data-[state=checked]:bg-destructive focus-visible:ring-destructive",
        success: "data-[state=checked]:bg-success focus-visible:ring-success",
        warning: "data-[state=checked]:bg-warning focus-visible:ring-warning",
        neutral:
          "data-[state=checked]:bg-foreground focus-visible:ring-foreground",
      },
      radius: radiusClasses,
    },
    defaultVariants: {
      size: "md",
      color: "primary",
      radius: "full",
    },
  },
);

const switchThumbVariants = cva(
  "pointer-events-none block border-2 border-border bg-background shadow-neo-sm transition-transform data-[state=unchecked]:translate-x-0",
  {
    variants: {
      size: {
        sm: "size-3.5 data-[state=checked]:translate-x-4",
        md: "size-4 data-[state=checked]:translate-x-5",
        lg: "size-5 data-[state=checked]:translate-x-6",
      },
      radius: radiusClasses,
    },
    defaultVariants: {
      size: "md",
      radius: "full",
    },
  },
);

export interface SwitchProps
  extends
    Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, "color">,
    VariantProps<typeof switchVariants> {}

const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, size, color, radius, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      switchVariants({ size, color, radius }),
      "bg-muted",
      className,
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb className={switchThumbVariants({ size, radius })} />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch, switchVariants };
