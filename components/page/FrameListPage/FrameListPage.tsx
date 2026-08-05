"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/constants/route";
import { useDeleteFrame, useFrames } from "@/hooks/queries";
import { DataTable } from "@/components/shared/DataTable";
import { ApiErrorAlert } from "@/components/shared/ApiErrorAlert";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { toast } from "@/components/ui/Toast";
import { ApiError, parseApiErrorMessage } from "@/libs/api";
import type { FrameDto } from "@/types";

export function FrameListPage() {
  const [search, setSearch] = React.useState("");
  const { data, isLoading, error } = useFrames();
  const deleteMutation = useDeleteFrame();

  const columns = React.useMemo<ColumnDef<FrameDto>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nama",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "background_color",
        header: "Background",
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-2">
            <span
              className="border-border size-4 rounded border"
              style={{ backgroundColor: row.original.background_color }}
            />
            {row.original.background_color}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <Badge variant="soft">{row.original.status}</Badge>,
      },
      {
        id: "layouts",
        header: "Layouts",
        cell: ({ row }) => row.original.supported_layouts?.length ?? 0,
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
                if (!window.confirm(`Hapus frame "${row.original.name}"?`)) {
                  return;
                }
                deleteMutation.mutate(row.original.id, {
                  onSuccess: () => toast.success("Frame dihapus."),
                  onError: (err) =>
                    toast.error(
                      err instanceof ApiError
                        ? parseApiErrorMessage(err.body, err.message)
                        : "Gagal hapus frame.",
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
          <h1 className="font-display text-2xl font-bold">Frames</h1>
          <p className="text-muted-foreground text-sm">
            Kelola frame dan asset overlay.
          </p>
        </div>
        <Button asChild>
          <Link href={ROUTES.DASHBOARD.FRAMES_NEW}>
            <Plus className="mr-2 size-4" />
            Buat frame
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
        searchPlaceholder="Cari frame..."
        emptyMessage="Belum ada frame. Yuk buat yang pertama."
      />
    </div>
  );
}
