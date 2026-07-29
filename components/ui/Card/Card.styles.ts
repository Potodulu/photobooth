import { cva, type VariantProps } from "class-variance-authority";
import { elevationClasses, radiusClasses } from "@/libs/configs/variants";

export const cardVariants = cva("border-2 border-border text-card-foreground", {
  variants: {
    color: {
      default: "bg-card",
      primary: "bg-primary/30",
      secondary: "bg-secondary/30",
      accent: "bg-accent/40",
    },
    radius: radiusClasses,
    elevation: elevationClasses,
  },
  defaultVariants: {
    color: "default",
    radius: "lg",
    elevation: "md",
  },
});

export type CardVariantProps = VariantProps<typeof cardVariants>;
