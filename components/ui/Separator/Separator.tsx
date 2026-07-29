"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/libs/cn";

const separatorVariants = cva("shrink-0", {
  variants: {
    orientation: {
      horizontal: "h-0.5 w-full",
      vertical: "h-full w-0.5",
    },
    color: {
      muted: "bg-muted",
      border: "bg-border",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    color: "border",
  },
});

export type SeparatorProps = Omit<
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>,
  "color"
> &
  VariantProps<typeof separatorVariants>;

const Separator = React.forwardRef<
  React.ComponentRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(({ className, orientation, color, decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation ?? "horizontal"}
    className={cn(separatorVariants({ orientation, color }), className)}
    {...props}
  />
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator, separatorVariants };
