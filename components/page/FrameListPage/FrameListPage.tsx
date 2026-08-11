"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/constants/route";
import { useDeleteFrame, useFrames, useLayouts } from "@/hooks/queries";
import { DataTable } from "@/components/shared/DataTable";
import { ApiErrorAlert } from "@/components/shared/ApiErrorAlert";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { toast } from "@/components/ui/Toast";
import { ApiError, parseApiErrorMessage } from "@/libs/api";
import type { FrameDto } from "@/types";

export function FrameListPage() {
  const t = useTranslations("FrameListPage");
  const [search, setSearch] = React.useState("");
  const { data, isLoading, error } = useFrames();
  const { data: layoutsData } = useLayouts({ per_page: 100 });
  const deleteMutation = useDeleteFrame();

  const layoutNameById = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const layout of layoutsData?.data ?? []) {
      map.set(layout.id, layout.name);
    }
    return map;
  }, [layoutsData?.data]);

  const columns = React.useMemo<ColumnDef<FrameDto>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("columnName"),
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "background_color",
        header: t("columnBackground"),
        cell: ({ row }) => {
          const color = row.original.background_color;
          if (!color) return t("layoutNone");
          return (
            <span className="inline-flex items-center gap-2">
              <span
                className="border-border size-4 rounded border"
                style={{ backgroundColor: color }}
              />
              {color}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: t("columnStatus"),
        cell: ({ row }) => <Badge variant="soft">{row.original.status}</Badge>,
      },
      {
        id: "layout",
        header: t("columnLayout"),
        cell: ({ row }) => {
          const layoutId = row.original.layout_id;
          if (!layoutId) return t("layoutNone");
          return layoutNameById.get(layoutId) ?? layoutId.slice(0, 8);
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="sm" asChild>
              <Link href={ROUTES.DASHBOARD.frameEdit(row.original.id)}>
                <Pencil className="size-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              color="destructive"
              loading={
                deleteMutation.isPending &&
                deleteMutation.variables === row.original.id
              }
              onClick={() => {
                if (
                  !window.confirm(
                    t("deleteConfirm", { name: row.original.name }),
                  )
                ) {
                  return;
                }
                deleteMutation.mutate(row.original.id, {
                  onSuccess: () => toast.success(t("deleteSuccess")),
                  onError: (err) =>
                    toast.error(
                      err instanceof ApiError
                        ? parseApiErrorMessage(err.body, err.message)
                        : t("deleteError"),
                    ),
                });
              }}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    [deleteMutation, layoutNameById, t],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
        </div>
        <Button asChild>
          <Link href={ROUTES.DASHBOARD.FRAMES_NEW}>
            <Plus className="mr-2 size-4" />
            {t("create")}
          </Link>
        </Button>
      </div>

      <ApiErrorAlert error={error} />

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("searchPlaceholder")}
        emptyMessage={t("empty")}
      />
    </div>
  );
}
