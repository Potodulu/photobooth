"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROLES } from "@/config/dashboard/roles";
import { RoleGuard } from "@/components/module/auth/RoleGuard";
import { useProfile, useUpdateProfile } from "@/hooks/queries";
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
import { toast } from "@/components/ui/Toast";
import { ApiError, parseApiErrorMessage } from "@/libs/api";

const profileSchema = z.object({
  full_name: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z.string().optional(),
  bio: z.string().optional(),
  avatar_url: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function ProfileFormInner() {
  const { data, isLoading, error: loadError } = useProfile();
  const updateMutation = useUpdateProfile();
  const [error, setError] = React.useState<unknown>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      bio: "",
      avatar_url: "",
    },
  });

  React.useEffect(() => {
    if (!data) return;
    form.reset({
      full_name: data.full_name ?? "",
      phone: data.phone ?? "",
      bio: data.bio ?? "",
      avatar_url: data.avatar_url ?? "",
    });
  }, [data, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    try {
      await updateMutation.mutateAsync({
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

  if (isLoading) {
    return <FormSkeleton fields={4} className="max-w-xl" />;
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground text-sm">
          Update info profil kamu.
        </p>
      </div>

      <ApiErrorAlert error={loadError ?? error} />

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
            loading={form.formState.isSubmitting || updateMutation.isPending}
          >
            Simpan profile
          </Button>
        </form>
      </Form>
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
