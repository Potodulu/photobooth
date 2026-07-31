"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Smartphone } from "lucide-react";
import { cn } from "@/libs/cn";

type LandscapeOrientationGuardProps = {
  active: boolean;
  message: string;
  className?: string;
};

export function LandscapeOrientationGuard({
  active,
  message,
  className,
}: LandscapeOrientationGuardProps) {
  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          key="orientation-guard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "bg-background fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 p-6 text-center",
            className,
          )}
          role="dialog"
          aria-modal="true"
          aria-live="polite"
          aria-label={message}
        >
          <div
            className="border-border bg-muted/40 shadow-neo-md relative flex size-32 items-center justify-center rounded-[var(--radius-xl)] border-2"
            aria-hidden
          >
            <Smartphone
              className="text-primary size-14 -rotate-90"
              strokeWidth={2}
            />
            <span className="border-border bg-accent absolute -right-2 -bottom-2 flex size-10 items-center justify-center rounded-full border-2 text-lg">
              ↻
            </span>
          </div>
          <p className="font-display max-w-sm text-xl font-bold">{message}</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
