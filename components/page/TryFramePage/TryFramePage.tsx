"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/constants/route";

/** Orphaned: frame pick moved to /online/select. Keep route for deep links. */
export function TryFramePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(ROUTES.ONLINE.SELECT);
  }, [router]);

  return null;
}
