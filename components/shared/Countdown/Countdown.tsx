"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/libs/cn";

type CountdownProps = {
  value: number | null;
  className?: string;
};

export function Countdown({ value, className }: CountdownProps) {
  return (
    <AnimatePresence mode="wait">
      {value !== null && value > 0 ? (
        <motion.div
          key={value}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.25 }}
          className={cn(
            "pointer-events-none absolute inset-0 z-10 flex items-center justify-center",
            className,
          )}
        >
          <span className="font-display text-background text-7xl font-extrabold drop-shadow-lg sm:text-8xl">
            {value}
          </span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
