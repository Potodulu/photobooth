import { cva, type VariantProps } from "class-variance-authority";
import { elevationClasses, radiusClasses } from "@/libs/configs/variants";

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold whitespace-nowrap border-2 border-border transition-[transform,box-shadow,background-color,opacity] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:translate-x-[1px] active:translate-y-[1px]",
  {
    variants: {
      variant: {
        solid: "",
        soft: "",
        outline: "bg-transparent",
        ghost: "border-transparent shadow-none",
        link: "border-transparent shadow-none underline-offset-4 hover:underline bg-transparent",
      },
      color: {
        primary: "",
        secondary: "",
        accent: "",
        destructive: "",
        success: "",
        warning: "",
        neutral: "",
      },
      size: {
        sm: "h-8 px-3 text-sm gap-1.5",
        md: "h-10 px-4 text-sm gap-2",
        lg: "h-12 px-5 text-base gap-2",
        xl: "h-14 px-6 text-lg gap-2.5",
        icon: "size-10 p-0",
      },
      radius: radiusClasses,
      elevation: elevationClasses,
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "solid",
        color: "primary",
        class: "bg-primary text-primary-foreground hover:brightness-95",
      },
      {
        variant: "solid",
        color: "secondary",
        class: "bg-secondary text-secondary-foreground hover:brightness-95",
      },
      {
        variant: "solid",
        color: "accent",
        class: "bg-accent text-accent-foreground hover:brightness-95",
      },
      {
        variant: "solid",
        color: "destructive",
        class: "bg-destructive text-destructive-foreground hover:brightness-95",
      },
      {
        variant: "solid",
        color: "success",
        class: "bg-success text-success-foreground hover:brightness-95",
      },
      {
        variant: "solid",
        color: "warning",
        class: "bg-warning text-warning-foreground hover:brightness-95",
      },
      {
        variant: "solid",
        color: "neutral",
        class: "bg-foreground text-background hover:opacity-90",
      },
      {
        variant: "soft",
        color: "primary",
        class: "bg-primary/30 text-primary-foreground hover:bg-primary/40",
      },
      {
        variant: "soft",
        color: "secondary",
        class:
          "bg-secondary/30 text-secondary-foreground hover:bg-secondary/40",
      },
      {
        variant: "soft",
        color: "accent",
        class: "bg-accent/40 text-accent-foreground hover:bg-accent/50",
      },
      {
        variant: "soft",
        color: "destructive",
        class:
          "bg-destructive/25 text-destructive-foreground hover:bg-destructive/35",
      },
      {
        variant: "soft",
        color: "success",
        class: "bg-success/30 text-success-foreground hover:bg-success/40",
      },
      {
        variant: "soft",
        color: "warning",
        class: "bg-warning/30 text-warning-foreground hover:bg-warning/40",
      },
      {
        variant: "soft",
        color: "neutral",
        class: "bg-muted text-foreground hover:bg-muted/80",
      },
      {
        variant: "outline",
        color: "primary",
        class: "text-primary-foreground bg-background hover:bg-primary/20",
      },
      {
        variant: "outline",
        color: "secondary",
        class: "text-secondary-foreground bg-background hover:bg-secondary/20",
      },
      {
        variant: "outline",
        color: "accent",
        class: "text-accent-foreground bg-background hover:bg-accent/20",
      },
      {
        variant: "outline",
        color: "destructive",
        class:
          "text-destructive-foreground bg-background hover:bg-destructive/15",
      },
      {
        variant: "outline",
        color: "success",
        class: "text-success-foreground bg-background hover:bg-success/20",
      },
      {
        variant: "outline",
        color: "warning",
        class: "text-warning-foreground bg-background hover:bg-warning/20",
      },
      {
        variant: "outline",
        color: "neutral",
        class: "text-foreground bg-background hover:bg-muted",
      },
      {
        variant: "ghost",
        color: "primary",
        class: "text-primary-foreground hover:bg-primary/20",
      },
      {
        variant: "ghost",
        color: "secondary",
        class: "text-secondary-foreground hover:bg-secondary/20",
      },
      {
        variant: "ghost",
        color: "accent",
        class: "text-accent-foreground hover:bg-accent/20",
      },
      {
        variant: "ghost",
        color: "destructive",
        class: "text-destructive-foreground hover:bg-destructive/15",
      },
      {
        variant: "ghost",
        color: "success",
        class: "text-success-foreground hover:bg-success/20",
      },
      {
        variant: "ghost",
        color: "warning",
        class: "text-warning-foreground hover:bg-warning/20",
      },
      {
        variant: "ghost",
        color: "neutral",
        class: "text-foreground hover:bg-muted",
      },
      {
        variant: "link",
        color: "primary",
        class: "text-primary-foreground",
      },
      {
        variant: "link",
        color: "secondary",
        class: "text-secondary-foreground",
      },
      {
        variant: "link",
        color: "accent",
        class: "text-accent-foreground",
      },
      {
        variant: "link",
        color: "destructive",
        class: "text-destructive-foreground",
      },
      {
        variant: "link",
        color: "success",
        class: "text-success-foreground",
      },
      {
        variant: "link",
        color: "warning",
        class: "text-warning-foreground",
      },
      {
        variant: "link",
        color: "neutral",
        class: "text-foreground",
      },
      {
        variant: ["ghost", "link"],
        elevation: ["sm", "md", "lg"],
        class: "shadow-none",
      },
    ],
    defaultVariants: {
      variant: "solid",
      color: "primary",
      size: "md",
      radius: "lg",
      elevation: "md",
      fullWidth: false,
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
