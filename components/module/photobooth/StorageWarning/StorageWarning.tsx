"use client";

import { useTranslations } from "next-intl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";

type StorageWarningProps = {
  open: boolean;
  loading?: boolean;
  onContinue: () => void;
  onCancel: () => void;
};

export function StorageWarning({
  open,
  loading = false,
  onContinue,
  onCancel,
}: StorageWarningProps) {
  const t = useTranslations("OnlineWarning");

  return (
    <AlertDialog open={open}>
      <AlertDialogContent radius="xl" elevation="lg" className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-2xl font-extrabold">
            {t("title")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base leading-relaxed">
            {t("description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            variant="outline"
            color="neutral"
            radius="lg"
            disabled={loading}
            onClick={onCancel}
          >
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="solid"
            color="primary"
            radius="lg"
            loading={loading}
            onClick={onContinue}
          >
            {t("continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
