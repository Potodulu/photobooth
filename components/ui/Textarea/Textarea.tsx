import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/libs/cn";
import { elevationClasses, radiusClasses } from "@/libs/configs/variants";

const textareaVariants = cva(
  "flex w-full resize-y border-2 border-border bg-background px-3 py-2 text-foreground transition-[box-shadow,transform] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "min-h-20 px-2.5 py-1.5 text-sm",
        md: "min-h-24 py-2 text-sm",
        lg: "min-h-28 px-4 py-3 text-base",
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

export interface TextareaProps
  extends
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "color">,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size, radius, elevation, color, fullWidth, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        textareaVariants({ size, radius, elevation, color, fullWidth }),
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
