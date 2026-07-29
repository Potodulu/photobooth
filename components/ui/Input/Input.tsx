import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/libs/cn";
import { elevationClasses, radiusClasses } from "@/libs/configs/variants";

const inputVariants = cva(
  "flex border-2 border-border bg-background text-foreground transition-[box-shadow,transform] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-8 px-2.5 text-sm",
        md: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      },
      radius: radiusClasses,
      elevation: elevationClasses,
      color: {
        primary: "focus-visible:ring-primary",
        secondary: "focus-visible:ring-secondary",
        accent: "focus-visible:ring-accent",
        destructive: "focus-visible:ring-destructive",
        success: "focus-visible:ring-success",
        warning: "focus-visible:ring-warning",
        neutral: "focus-visible:ring-foreground",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      radius: "lg",
      elevation: "none",
      color: "primary",
      fullWidth: true,
    },
  },
);

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "color">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      size,
      radius,
      elevation,
      color,
      fullWidth,
      ...props
    },
    ref,
  ) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        inputVariants({ size, radius, elevation, color, fullWidth }),
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input, inputVariants };
