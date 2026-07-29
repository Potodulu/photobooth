import { cva, type VariantProps } from "class-variance-authority";
import { elevationClasses, radiusClasses } from "@/libs/configs/variants";

export const overlayContentVariants = cva(
  "border-2 border-border bg-popover text-popover-foreground",
  {
    variants: {
      radius: radiusClasses,
      elevation: elevationClasses,
    },
    defaultVariants: {
      radius: "lg",
      elevation: "md",
    },
  },
);

export type OverlayContentVariantProps = VariantProps<
  typeof overlayContentVariants
>;

export const sheetVariants = cva(
  "fixed z-50 gap-4 border-2 border-border bg-popover p-6 text-popover-foreground transition-transform duration-300 ease-in-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:-translate-y-full data-[state=open]:translate-y-0",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:translate-y-full data-[state=open]:translate-y-0",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0 sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:translate-x-full data-[state=open]:translate-x-0 sm:max-w-sm",
      },
      radius: radiusClasses,
      elevation: elevationClasses,
    },
    defaultVariants: {
      side: "right",
      radius: "lg",
      elevation: "md",
    },
  },
);

export type SheetVariantProps = VariantProps<typeof sheetVariants>;
