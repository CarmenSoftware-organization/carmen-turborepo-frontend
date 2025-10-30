"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignInFormValues, createSignInSchema } from "@/dtos/sign-in.dto";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { PasswordInput } from "./ui-custom/PasswordInput";
import { useSignInMutation } from "@/hooks/use-auth-query";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface Props {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export default function SignInDialog({ open, onOpenChange }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setSession } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>("");
  const t = useTranslations("SignInPage");
  const signInMutation = useSignInMutation();

  // เก็บ path ปัจจุบันเมื่อ dialog เปิด
  useEffect(() => {
    if (open) {
      const params = new URLSearchParams(searchParams);
      const queryString = params.toString();
      const fullPath = queryString ? `${pathname}?${queryString}` : pathname;
      setCurrentPath(fullPath);
    }
  }, [open, pathname, searchParams]);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(createSignInSchema(t)),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (values: SignInFormValues) => {
    signInMutation.mutate(
      { email: values.email, password: values.password },
      {
        onSuccess: (result) => {
          if (result?.access_token && result?.refresh_token) {
            setSession(result.access_token, result.refresh_token);
            form.reset();
            onOpenChange(false);

            setTimeout(() => {
              router.push(currentPath || "/dashboard");
            }, 100);
          } else {
            form.setError("root", {
              message: result?.message ?? t("signInError"),
            });
          }
        },
        onError: (error) => {
          console.error("Sign in error:", error);
          form.setError("root", {
            message: t("signInError"),
          });
          toast.error(t("signInError"));
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("sessionExpired")}</DialogTitle>
          <DialogDescription>{t("sessionExpiredDescription")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("emailPlaceholder")}
                      type="email"
                      autoComplete="email"
                      disabled={signInMutation.isPending}
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
                  <FormLabel>{t("password")}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t("passwordPlaceholder")}
                      type="password"
                      autoComplete="current-password"
                      disabled={signInMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <div className="text-sm font-medium text-destructive">
                {form.formState.errors.root.message}
              </div>
            )}

            <DialogFooter>
              <Button
                type="submit"
                className="w-40 h-10 bg-primary hover:bg-primary/90 text-white rounded-full"
                disabled={signInMutation.isPending}
              >
                {signInMutation.isPending ? t("signingIn") : t("signIn")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
