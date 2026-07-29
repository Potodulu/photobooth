"use client";

import * as React from "react";
import { Toaster as Sonner, toast } from "sonner";
import { cn } from "@/libs/cn";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ className, toastOptions, ...props }: ToasterProps) => (
  <Sonner
    className={cn("toaster group", className)}
    toastOptions={{
      ...toastOptions,
      classNames: {
        toast: cn(
          "group toast border-2 border-border bg-popover text-popover-foreground shadow-neo-md rounded-[var(--radius-lg)]",
          toastOptions?.classNames?.toast,
        ),
        title: cn("text-sm font-semibold", toastOptions?.classNames?.title),
        description: cn(
          "text-sm text-muted-foreground",
          toastOptions?.classNames?.description,
        ),
        actionButton: cn(
          "border-2 border-border bg-primary text-primary-foreground font-semibold rounded-[var(--radius-sm)]",
          toastOptions?.classNames?.actionButton,
        ),
        cancelButton: cn(
          "border-2 border-border bg-muted text-foreground font-semibold rounded-[var(--radius-sm)]",
          toastOptions?.classNames?.cancelButton,
        ),
        closeButton: cn(
          "border-2 border-border bg-background text-foreground rounded-[var(--radius-sm)]",
          toastOptions?.classNames?.closeButton,
        ),
        ...toastOptions?.classNames,
      },
    }}
    {...props}
  />
);

export { Toaster, toast };
