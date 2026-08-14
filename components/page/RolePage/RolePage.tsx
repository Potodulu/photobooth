"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Plus, Edit, Trash2 } from "lucide-react";
import { ROLES } from "@/config/dashboard/roles";
import { RoleGuard } from "@/components/module/auth/RoleGuard";
import {
  useRoleList,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from "@/hooks/queries";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";
import { toast } from "@/components/ui/Toast";
import type { RoleDto } from "@/types";

function RoleContent() {
  const t = useTranslations("RolePage");
  const { data: roles = [], isLoading } = useRoleList();
  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const deleteMutation = useDeleteRole();

  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<RoleDto | null>(null);

  const [formData, setFormData] = React.useState({
    name: "",
    code: "",
    description: "",
    permissions: "",
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        name: formData.name,
        code: formData.code,
        description: formData.description,
        permissions: formData.permissions
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean),
      });
      toast.success(t("addModal.success"));
      setIsAddOpen(false);
      setFormData({ name: "", code: "", description: "", permissions: "" });
    } catch {
      toast.error(t("addModal.error"));
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    try {
      await updateMutation.mutateAsync({
        id: selectedRole.id,
        data: {
          name: formData.name,
          description: formData.description,
          permissions: formData.permissions
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean),
        },
      });
      toast.success(t("editModal.success"));
      setIsEditOpen(false);
      setSelectedRole(null);
    } catch {
      toast.error(t("editModal.error"));
    }
  };

  const handleDelete = async (role: RoleDto) => {
    if (confirm(t("delete.confirm", { name: role.name }))) {
      try {
        await deleteMutation.mutateAsync(role.id);
        toast.success(t("delete.success"));
      } catch {
        toast.error(t("delete.error"));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 size-4" />
          {t("addRole")}
        </Button>
      </div>

      {isLoading ? (
        <div className="border-border bg-card text-muted-foreground rounded-xl border p-8 text-center text-sm">
          {t("loading")}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <div
              key={role.id}
              className="border-border bg-card flex flex-col justify-between space-y-4 rounded-xl border p-5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">{role.name}</h3>
                  <Badge variant="outline">{role.code}</Badge>
                </div>
                <p className="text-muted-foreground mt-2 text-sm">
                  {role.description}
                </p>

                <div className="mt-4 space-y-2">
                  <span className="text-muted-foreground text-xs font-semibold uppercase">
                    {t("permissions")}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(role.permissions ?? []).map((perm) => (
                      <Badge key={perm} variant="secondary" className="text-xs">
                        {perm}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-border flex items-center justify-between border-t pt-3">
                <span className="text-muted-foreground text-xs">
                  {t("userCount", { count: role.user_count })}
                </span>
                <div className="space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedRole(role);
                      setFormData({
                        name: role.name,
                        code: role.code,
                        description: role.description,
                        permissions: (role.permissions ?? []).join(", "),
                      });
                      setIsEditOpen(true);
                    }}
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(role)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Role Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("addModal.title")}</DialogTitle>
            <DialogDescription>{t("addModal.description")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                {t("addModal.name")}
              </label>
              <Input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                {t("addModal.code")}
              </label>
              <Input
                required
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                {t("addModal.descriptionLabel")}
              </label>
              <Textarea
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                {t("addModal.permissionsLabel")}
              </label>
              <Input
                placeholder="frame.create, layout.edit"
                value={formData.permissions}
                onChange={(e) =>
                  setFormData({ ...formData, permissions: e.target.value })
                }
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
              >
                {t("addModal.cancel")}
              </Button>
              <Button type="submit" loading={createMutation.isPending}>
                {t("addModal.save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Role Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editModal.title")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                {t("editModal.name")}
              </label>
              <Input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                {t("editModal.descriptionLabel")}
              </label>
              <Textarea
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                {t("editModal.permissionsLabel")}
              </label>
              <Input
                value={formData.permissions}
                onChange={(e) =>
                  setFormData({ ...formData, permissions: e.target.value })
                }
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
              >
                {t("editModal.cancel")}
              </Button>
              <Button type="submit" loading={updateMutation.isPending}>
                {t("editModal.save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function RolePage() {
  return (
    <RoleGuard roles={[ROLES.ADMIN]}>
      <RoleContent />
    </RoleGuard>
  );
}
