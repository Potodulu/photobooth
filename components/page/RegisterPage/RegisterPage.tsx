"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/constants/route";
import { ApiError, parseApiErrorMessage } from "@/libs/api";
import { useAuthActions } from "@/hooks/useAuthActions";
import { GuestGuard } from "@/components/module/auth/GuestGuard";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { ApiErrorAlert } from "@/components/shared/ApiErrorAlert";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { toast } from "@/components/ui/Toast";

const registerSchema = z.object({
  full_name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.email("Email tidak valid"),
  password: z.string().min(6, "Minimal 6 karakter"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const { register: registerAction } = useAuthActions();
  const [error, setError] = React.useState<unknown>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { full_name: "", email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    try {
      await registerAction(values);
      toast.success("Akun berhasil dibuat.");
    } catch (err) {
      setError(err);
      toast.error(
        err instanceof ApiError
          ? parseApiErrorMessage(err.body, err.message)
          : "Gagal daftar. Coba lagi ya.",
      );
    }
  });

  return (
    <GuestGuard>
      <MarketingLayout className="items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Daftar</CardTitle>
            <CardDescription>
              Buat akun baru biar siap foto bareng.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-4">
                <ApiErrorAlert error={error} />

                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama lengkap</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="name"
                          placeholder="Nama kamu"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="email"
                          placeholder="nama@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="new-password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  fullWidth
                  loading={form.formState.isSubmitting}
                >
                  Daftar
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="text-muted-foreground justify-center text-sm">
            Sudah punya akun?{" "}
            <Link
              href={ROUTES.LOGIN}
              className="text-primary ml-1 font-medium underline-offset-4 hover:underline"
            >
              Masuk
            </Link>
          </CardFooter>
        </Card>
      </MarketingLayout>
    </GuestGuard>
  );
}
