"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
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
import { PageLoading } from "@/components/shared/PageLoading";
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

const loginSchema = z.object({
  email: z.email("Email tidak valid"),
  password: z.string().min(6, "Minimal 6 karakter"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const { login } = useAuthActions();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? undefined;
  const [error, setError] = React.useState<unknown>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    try {
      await login(values, redirectTo);
      toast.success("Berhasil masuk.");
    } catch (err) {
      setError(err);
      toast.error(
        err instanceof ApiError
          ? parseApiErrorMessage(err.body, err.message)
          : "Gagal login. Coba lagi ya.",
      );
    }
  });

  return (
    <MarketingLayout className="items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Masuk</CardTitle>
          <CardDescription>
            Yuk lanjut abadikan momen. Masuk dulu ya.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <ApiErrorAlert error={error} />

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
                        autoComplete="current-password"
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
                Masuk
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-muted-foreground justify-center text-sm">
          Belum punya akun?{" "}
          <Link
            href={ROUTES.REGISTER}
            className="text-primary ml-1 font-medium underline-offset-4 hover:underline"
          >
            Daftar
          </Link>
        </CardFooter>
      </Card>
    </MarketingLayout>
  );
}

export function LoginPage() {
  return (
    <GuestGuard>
      <React.Suspense fallback={<PageLoading message="Memuat..." />}>
        <LoginForm />
      </React.Suspense>
    </GuestGuard>
  );
}
