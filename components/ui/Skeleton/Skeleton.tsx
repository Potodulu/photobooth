import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/libs/cn";
import { radiusClasses } from "@/libs/configs/variants";

const skeletonVariants = cva("animate-pulse bg-muted", {
  variants: {
    variant: {
      text: "h-4 w-full",
      circle: "aspect-square rounded-full",
      rect: "size-full",
    },
    radius: radiusClasses,
  },
  defaultVariants: {
    variant: "rect",
    radius: "md",
  },
});

export interface SkeletonProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

function Skeleton({ className, variant, radius, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        skeletonVariants({
          variant,
          radius: variant === "circle" ? "full" : radius,
        }),
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton, skeletonVariants };
