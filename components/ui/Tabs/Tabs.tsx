"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/libs/cn";
import { elevationClasses, radiusClasses } from "@/libs/configs/variants";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "border-border bg-muted text-muted-foreground shadow-neo-sm inline-flex h-10 items-center justify-center gap-1 rounded-[var(--radius-lg)] border-2 p-1",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "focus-visible:ring-ring data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-neo-sm inline-flex flex-1 items-center justify-center border-2 border-transparent px-3 py-1.5 text-sm font-semibold whitespace-nowrap transition-[background-color,box-shadow,color] focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
      radiusClasses.md,
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "border-border bg-card text-card-foreground focus-visible:ring-ring mt-3 border-2 p-4 focus-visible:ring-2 focus-visible:outline-none",
      radiusClasses.lg,
      elevationClasses.sm,
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
