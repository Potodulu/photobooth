"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/libs/cn";

const radioGroupVariants = cva("grid gap-2");

const radioGroupItemVariants = cva(
  "aspect-square shrink-0 border-2 border-border bg-background shadow-neo-sm transition-[background-color,transform,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:shadow-none data-[state=checked]:translate-x-px data-[state=checked]:translate-y-px",
  {
    variants: {
      size: {
        sm: "size-4 [&_svg]:size-2",
        md: "size-5 [&_svg]:size-2.5",
        lg: "size-6 [&_svg]:size-3",
      },
      color: {
        primary:
          "text-primary focus-visible:ring-primary data-[state=checked]:border-primary",
        secondary:
          "text-secondary focus-visible:ring-secondary data-[state=checked]:border-secondary",
        accent:
          "text-accent focus-visible:ring-accent data-[state=checked]:border-accent",
        destructive:
          "text-destructive focus-visible:ring-destructive data-[state=checked]:border-destructive",
        success:
          "text-success focus-visible:ring-success data-[state=checked]:border-success",
        warning:
          "text-warning focus-visible:ring-warning data-[state=checked]:border-warning",
        neutral:
          "text-foreground focus-visible:ring-foreground data-[state=checked]:border-foreground",
      },
    },
    defaultVariants: {
      size: "md",
      color: "primary",
    },
  },
);

export interface RadioGroupProps
  extends
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
    VariantProps<typeof radioGroupVariants> {}

const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn(radioGroupVariants(), className)}
    {...props}
  />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export interface RadioGroupItemProps
  extends
    Omit<
      React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
      "color"
    >,
    VariantProps<typeof radioGroupItemVariants> {}

const RadioGroupItem = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, size, color, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      radioGroupItemVariants({ size, color }),
      "rounded-full",
      className,
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <Circle className="fill-current" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem, radioGroupItemVariants };
