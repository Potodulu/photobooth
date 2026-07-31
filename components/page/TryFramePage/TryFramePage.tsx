"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";

/** Orphaned: frame pick moved to /try/select. Keep route for deep links. */
export function TryFramePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/try/select");
  }, [router]);

  return null;
}
