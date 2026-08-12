"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/constants/route";
import { useDeleteLayout, useLayouts } from "@/hooks/queries";
import { DataTable } from "@/components/shared/DataTable";
import { ApiErrorAlert } from "@/components/shared/ApiErrorAlert";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { toast } from "@/components/ui/Toast";
import { ApiError, parseApiErrorMessage } from "@/libs/api";
import type { LayoutDto } from "@/types";

export function LayoutListPage() {
  const [search, setSearch] = React.useState("");
  const { data, isLoading, error } = useLayouts();
  const deleteMutation = useDeleteLayout();

  const columns = React.useMemo<ColumnDef<LayoutDto>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nama",
        cell: ({ row }) => (
          <Link
            href={ROUTES.DASHBOARD.layoutDetail(row.original.id)}
            className="hover:text-primary font-medium underline-offset-4 hover:underline"
          >
            {row.original.name}
          </Link>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <Badge variant="soft">{row.original.status}</Badge>,
      },
      {
        accessorKey: "aspect_ratio",
        header: "Aspect",
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="sm" asChild>
              <Link href={ROUTES.DASHBOARD.layoutDetail(row.original.id)}>
                <Eye className="size-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href={ROUTES.DASHBOARD.layoutEdit(row.original.id)}>
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
                if (!window.confirm(`Hapus layout "${row.original.name}"?`)) {
                  return;
                }
                deleteMutation.mutate(row.original.id, {
                  onSuccess: () => toast.success("Layout dihapus."),
                  onError: (err) =>
                    toast.error(
                      err instanceof ApiError
                        ? parseApiErrorMessage(err.body, err.message)
                        : "Gagal hapus layout.",
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
    [deleteMutation],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Layouts</h1>
          <p className="text-muted-foreground text-sm">
            Kelola template layout fotobooth.
          </p>
        </div>
        <Button asChild>
          <Link href={ROUTES.DASHBOARD.LAYOUTS_NEW}>
            <Plus className="mr-2 size-4" />
            Buat layout
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
        searchPlaceholder="Cari layout..."
        emptyMessage="Belum ada layout. Yuk buat yang pertama."
      />
    </div>
  );
}
