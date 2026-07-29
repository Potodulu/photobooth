"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/libs/cn";

type FlashOverlayProps = {
  active: boolean;
  className?: string;
};

export function FlashOverlay({ active, className }: FlashOverlayProps) {
  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          key="flash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.08 }}
          className={cn(
            "pointer-events-none fixed inset-0 z-[100] bg-white",
            className,
          )}
        />
      ) : null}
    </AnimatePresence>
  );
}
