"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  UserPlus,
  Edit,
  UserX,
  Eye,
  Copy,
  RefreshCw,
  Check,
} from "lucide-react";
import { ROLES } from "@/config/dashboard/roles";
import { RoleGuard } from "@/components/module/auth/RoleGuard";
import {
  useUserAccessList,
  useCreateUserAccess,
  useUpdateUserAccess,
  useInactivateUserAccess,
} from "@/hooks/queries";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";
import { toast } from "@/components/ui/Toast";
import type { RoleCode, UserAccountDto } from "@/types";

function UserTable({
  users,
  onView,
  onEdit,
  onInactivate,
}: {
  users: UserAccountDto[];
  onView: (user: UserAccountDto) => void;
  onEdit: (user: UserAccountDto) => void;
  onInactivate: (user: UserAccountDto) => void;
}) {
  const t = useTranslations("UserAccessPage");

  if (users.length === 0) {
    return (
      <div className="border-border bg-card text-muted-foreground rounded-xl border p-8 text-center text-sm">
        {t("empty")}
      </div>
    );
  }

  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-muted-foreground border-border border-b text-xs uppercase">
            <tr>
              <th className="px-4 py-3">{t("table.name")}</th>
              <th className="px-4 py-3">{t("table.email")}</th>
              <th className="px-4 py-3">{t("table.role")}</th>
              <th className="px-4 py-3">{t("table.status")}</th>
              <th className="px-4 py-3 text-right">{t("table.action")}</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/20">
                <td className="px-4 py-3 font-medium">{user.full_name}</td>
                <td className="text-muted-foreground px-4 py-3">
                  {user.email}
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline">{user.role}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={
                      user.status === "active" ? "default" : "destructive"
                    }
                  >
                    {user.status}
                  </Badge>
                </td>
                <td className="space-x-1 px-4 py-3 text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onView(user)}
                    title="View detail"
                  >
                    <Eye className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(user)}
                    title="Edit account"
                  >
                    <Edit className="size-4" />
                  </Button>
                  {user.status === "active" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onInactivate(user)}
                      title="Nonaktifkan"
                    >
                      <UserX className="size-4" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserAccessContent() {
  const t = useTranslations("UserAccessPage");
  const [activeTab, setActiveTab] = React.useState<RoleCode>("USER");
  const { data: users = [], isLoading } = useUserAccessList(activeTab);

  const createMutation = useCreateUserAccess();
  const updateMutation = useUpdateUserAccess();
  const inactivateMutation = useInactivateUserAccess();

  // Modals state
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<UserAccountDto | null>(
    null,
  );
  const [isViewOpen, setIsViewOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  // Form states
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    full_name: "",
    role: activeTab as RoleCode,
    phone: "",
  });

  const [generatedPassword, setGeneratedPassword] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  const generateRandomPassword = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pwd = "";
    for (let i = 0; i < 12; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(pwd);
    setFormData((prev) => ({ ...prev, password: pwd }));
    setCopied(false);
  };

  const handleCopyPassword = () => {
    if (!generatedPassword) return;
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    toast.success("Password copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        ...formData,
        role: activeTab,
      });
      toast.success(t("addModal.success"));
      setIsAddOpen(false);
      setFormData({
        email: "",
        password: "",
        full_name: "",
        role: activeTab,
        phone: "",
      });
    } catch {
      toast.error(t("addModal.error"));
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await updateMutation.mutateAsync({
        id: selectedUser.id,
        data: {
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          ...(formData.password ? { password: formData.password } : {}),
        },
      });
      toast.success(t("editModal.success"));
      setIsEditOpen(false);
      setSelectedUser(null);
    } catch {
      toast.error(t("editModal.error"));
    }
  };

  const handleInactivate = async (user: UserAccountDto) => {
    if (confirm(t("inactivate.confirm", { name: user.full_name }))) {
      try {
        await inactivateMutation.mutateAsync(user.id);
        toast.success(t("inactivate.success"));
      } catch {
        toast.error(t("inactivate.error"));
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
          <UserPlus className="mr-2 size-4" />
          {t("addUser")}
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as RoleCode)}
      >
        <TabsList>
          <TabsTrigger value="USER">{t("tabUser")}</TabsTrigger>
          <TabsTrigger value="CONTRIBUTOR">{t("tabContributor")}</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          {isLoading ? (
            <div className="border-border bg-card text-muted-foreground rounded-xl border p-8 text-center text-sm">
              {t("loading")}
            </div>
          ) : (
            <>
              <TabsContent value="USER">
                <UserTable
                  users={users}
                  onView={(u) => {
                    setSelectedUser(u);
                    setIsViewOpen(true);
                  }}
                  onEdit={(u) => {
                    setSelectedUser(u);
                    setFormData({
                      email: u.email,
                      password: "",
                      full_name: u.full_name,
                      role: u.role,
                      phone: u.phone || "",
                    });
                    setGeneratedPassword("");
                    setIsEditOpen(true);
                  }}
                  onInactivate={handleInactivate}
                />
              </TabsContent>
              <TabsContent value="CONTRIBUTOR">
                <UserTable
                  users={users}
                  onView={(u) => {
                    setSelectedUser(u);
                    setIsViewOpen(true);
                  }}
                  onEdit={(u) => {
                    setSelectedUser(u);
                    setFormData({
                      email: u.email,
                      password: "",
                      full_name: u.full_name,
                      role: u.role,
                      phone: u.phone || "",
                    });
                    setGeneratedPassword("");
                    setIsEditOpen(true);
                  }}
                  onInactivate={handleInactivate}
                />
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>

      {/* Add User Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("addModal.title", { role: activeTab })}
            </DialogTitle>
            <DialogDescription>
              {t("addModal.description", { role: activeTab })}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                {t("addModal.fullName")}
              </label>
              <Input
                required
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                {t("addModal.email")}
              </label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                {t("addModal.password")}
              </label>
              <Input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                {t("addModal.phone")}
              </label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
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

      {/* View Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("viewModal.title")}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-2 text-sm">
              <p>
                <strong>{t("viewModal.fullName")}</strong>{" "}
                {selectedUser.full_name}
              </p>
              <p>
                <strong>{t("viewModal.email")}</strong> {selectedUser.email}
              </p>
              <p>
                <strong>{t("viewModal.role")}</strong> {selectedUser.role}
              </p>
              <p>
                <strong>{t("viewModal.status")}</strong> {selectedUser.status}
              </p>
              <p>
                <strong>{t("viewModal.phone")}</strong>{" "}
                {selectedUser.phone || "-"}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>
              {t("viewModal.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Account Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editModal.title")}</DialogTitle>
            <DialogDescription>{t("editModal.description")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                {t("editModal.fullName")}
              </label>
              <Input
                required
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                {t("editModal.email")}
              </label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                {t("editModal.resetPassword")}
              </label>
              <div className="mt-1 flex items-center gap-2">
                <Input
                  type="text"
                  readOnly
                  placeholder="Klik icon buat password"
                  value={generatedPassword}
                  className="bg-muted font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateRandomPassword}
                  title="Generate Password"
                >
                  <RefreshCw className="size-4" />
                </Button>
                {generatedPassword && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCopyPassword}
                    title="Copy Password"
                  >
                    {copied ? (
                      <Check className="size-4 text-green-600" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </Button>
                )}
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                {t("editModal.resetHint")}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">
                {t("editModal.phone")}
              </label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
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

export function UserAccessPage() {
  return (
    <RoleGuard roles={[ROLES.ADMIN]}>
      <UserAccessContent />
    </RoleGuard>
  );
}
