"use client";

import * as React from "react";
import { DashboardHeader } from "@/components/module/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/module/dashboard/DashboardSidebar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/Sheet";
import { cn } from "@/libs/cn";

export function DashboardLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className={cn("bg-muted/30 flex min-h-dvh", className)}>
      <div className="hidden lg:block">
        <DashboardSidebar className="fixed inset-y-0 left-0 z-30" />
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Menu dashboard</SheetTitle>
          <DashboardSidebar onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <DashboardHeader onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
