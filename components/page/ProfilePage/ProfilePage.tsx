"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { ROLES } from "@/config/dashboard/roles";
import { RoleGuard } from "@/components/module/auth/RoleGuard";
import {
  useProfile,
  useUpdateProfile,
  useUpdateEmail,
  useChangePassword,
} from "@/hooks/queries";
import { ApiErrorAlert } from "@/components/shared/ApiErrorAlert";
import { FormSkeleton } from "@/components/shared/FormSkeleton";
import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { toast } from "@/components/ui/Toast";
import { ApiError, parseApiErrorMessage } from "@/libs/api";

const profileSchema = z.object({
  full_name: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z.string().optional(),
  bio: z.string().optional(),
  avatar_url: z.string().optional(),
});

const emailSchema = z.object({
  email: z.string().email("Email tidak valid"),
  current_password: z.string().optional(),
});

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Password saat ini wajib diisi"),
    new_password: z.string().min(6, "Password baru minimal 6 karakter"),
    confirm_password: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirm_password"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type EmailFormValues = z.infer<typeof emailSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

function ProfileFormInner() {
  const t = useTranslations("ProfileTabs");
  const { data, isLoading, error: loadError } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const updateEmailMutation = useUpdateEmail();
  const changePasswordMutation = useChangePassword();

  const [error, setError] = React.useState<unknown>(null);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      bio: "",
      avatar_url: "",
    },
  });

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
      current_password: "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  React.useEffect(() => {
    if (!data) return;
    profileForm.reset({
      full_name: data.full_name ?? "",
      phone: data.phone ?? "",
      bio: data.bio ?? "",
      avatar_url: data.avatar_url ?? "",
    });
    emailForm.reset({
      email: data.email ?? "",
      current_password: "",
    });
  }, [data, profileForm, emailForm]);

  const onProfileSubmit = profileForm.handleSubmit(async (values) => {
    setError(null);
    try {
      await updateProfileMutation.mutateAsync({
        full_name: values.full_name,
        phone: values.phone || null,
        bio: values.bio || null,
        avatar_url: values.avatar_url || null,
      });
      toast.success("Profile berhasil disimpan.");
    } catch (err) {
      setError(err);
      toast.error(
        err instanceof ApiError
          ? parseApiErrorMessage(err.body, err.message)
          : "Gagal menyimpan profile.",
      );
    }
  });

  const onEmailSubmit = emailForm.handleSubmit(async (values) => {
    setError(null);
    try {
      await updateEmailMutation.mutateAsync({
        email: values.email,
        current_password: values.current_password,
      });
      toast.success(t("emailForm.success"));
    } catch (err) {
      setError(err);
      toast.error(
        err instanceof ApiError
          ? parseApiErrorMessage(err.body, err.message)
          : t("emailForm.error"),
      );
    }
  });

  const onPasswordSubmit = passwordForm.handleSubmit(async (values) => {
    setError(null);
    try {
      await changePasswordMutation.mutateAsync({
        current_password: values.current_password,
        new_password: values.new_password,
      });
      toast.success(t("passwordForm.success"));
      passwordForm.reset();
    } catch (err) {
      setError(err);
      toast.error(
        err instanceof ApiError
          ? parseApiErrorMessage(err.body, err.message)
          : t("passwordForm.error"),
      );
    }
  });

  if (isLoading) {
    return <FormSkeleton fields={4} className="max-w-xl" />;
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">{t("pageTitle")}</h1>
        <p className="text-muted-foreground text-sm">{t("pageSubtitle")}</p>
      </div>

      <ApiErrorAlert error={loadError ?? error} />

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">{t("tabProfile")}</TabsTrigger>
          <TabsTrigger value="email">{t("tabEmail")}</TabsTrigger>
          <TabsTrigger value="password">{t("tabPassword")}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Form {...profileForm}>
            <form onSubmit={onProfileSubmit} className="space-y-4">
              <FormField
                control={profileForm.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama lengkap</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="avatar_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                loading={
                  profileForm.formState.isSubmitting ||
                  updateProfileMutation.isPending
                }
              >
                Simpan Profile
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="email" className="mt-4">
          <Form {...emailForm}>
            <form onSubmit={onEmailSubmit} className="space-y-4">
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("emailForm.newEmail")}</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={emailForm.control}
                name="current_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("emailForm.currentPassword")}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                loading={
                  emailForm.formState.isSubmitting ||
                  updateEmailMutation.isPending
                }
              >
                {t("emailForm.submit")}
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="password" className="mt-4">
          <Form {...passwordForm}>
            <form onSubmit={onPasswordSubmit} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="current_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("passwordForm.currentPassword")}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("passwordForm.newPassword")}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("passwordForm.confirmPassword")}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                loading={
                  passwordForm.formState.isSubmitting ||
                  changePasswordMutation.isPending
                }
              >
                {t("passwordForm.submit")}
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function ProfilePage() {
  return (
    <RoleGuard roles={[ROLES.ADMIN, ROLES.CONTRIBUTOR, ROLES.USER]}>
      <ProfileFormInner />
    </RoleGuard>
  );
}
