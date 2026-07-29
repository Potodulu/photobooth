import { cva, type VariantProps } from "class-variance-authority";
import { radiusClasses } from "@/libs/configs/variants";

export const alertVariants = cva(
  "relative w-full border-2 border-border p-4 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:top-4 [&>svg]:left-4 [&>svg]:text-current [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        solid: "",
        soft: "",
        outline: "bg-transparent",
      },
      color: {
        default: "",
        primary: "",
        secondary: "",
        accent: "",
        destructive: "",
        success: "",
        warning: "",
      },
      radius: radiusClasses,
    },
    compoundVariants: [
      {
        variant: "solid",
        color: "default",
        class: "bg-card text-card-foreground",
      },
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
        variant: "soft",
        color: "default",
        class: "bg-muted text-foreground",
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
        variant: "outline",
        color: "default",
        class: "text-foreground",
      },
      {
        variant: "outline",
        color: "primary",
        class: "text-primary-foreground",
      },
      {
        variant: "outline",
        color: "secondary",
        class: "text-secondary-foreground",
      },
      {
        variant: "outline",
        color: "accent",
        class: "text-accent-foreground",
      },
      {
        variant: "outline",
        color: "destructive",
        class: "text-destructive-foreground",
      },
      {
        variant: "outline",
        color: "success",
        class: "text-success-foreground",
      },
      {
        variant: "outline",
        color: "warning",
        class: "text-warning-foreground",
      },
    ],
    defaultVariants: {
      variant: "soft",
      color: "default",
      radius: "lg",
    },
  },
);

export type AlertVariantProps = VariantProps<typeof alertVariants>;
