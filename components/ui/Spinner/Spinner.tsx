import * as React from "react";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/libs/cn";

const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
      xl: "size-8",
    },
    color: {
      primary: "text-primary",
      secondary: "text-secondary",
      accent: "text-accent",
      destructive: "text-destructive",
      success: "text-success",
      warning: "text-warning",
      neutral: "text-foreground",
      muted: "text-muted-foreground",
    },
  },
  defaultVariants: {
    size: "md",
    color: "primary",
  },
});

export interface SpinnerProps
  extends
    Omit<React.ComponentPropsWithoutRef<typeof Loader2>, "color" | "size">,
    VariantProps<typeof spinnerVariants> {}

const Spinner = React.forwardRef<
  React.ComponentRef<typeof Loader2>,
  SpinnerProps
>(({ className, size, color, ...props }, ref) => (
  <Loader2
    ref={ref}
    className={cn(spinnerVariants({ size, color }), className)}
    {...props}
  />
));
Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
