"use client";

import { useAuth } from "@/context/AuthContext";
import { SignInFormValues, createSignInSchema } from "@/dtos/sign-in.dto";
import { Link, useRouter } from "@/lib/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import "@/styles/auth.css";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { toast } from "sonner";
import { useSignInMutation } from "@/hooks/use-auth-query";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import InputCustom from "@/components/ui-custom/InputCustom";

export default function SignInForm() {
  const router = useRouter();
  const { setSession } = useAuth();
  const t = useTranslations("SignInPage");
  const tHome = useTranslations("HomePage");

  const signInMutation = useSignInMutation();

  const signInSchema = createSignInSchema(t);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
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

            setTimeout(() => {
              router.push("/procurement/dashboard");
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
    <div className="login-page-wrapper">
      <div className="login-container">
        <div className="login-layout">
          <div className="login-info">
            <div className="avatar-wrapper">
              <Image
                src="/images/carmen_pic.jpg"
                alt="@shadcn"
                className="rounded-full"
                width={60}
                height={60}
                data-id="sidebar-logo-avatar-image"
              />
            </div>
            <p className="app-name">{tHome("CarmenSoftware")} V2</p>
            <p className="app-description">{tHome("HotelFinanceManagementSoftware")}</p>
          </div>

          <div className="login-form-wrapper">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  data-testid="email-input"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputCustom
                          data-id="sign-in-email"
                          label={t("email")}
                          labelPlacement="inside"
                          placeholder="This shows when input has value"
                          required
                          autoComplete="username"
                          {...field}
                          className="h-12 sm:h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  data-testid="password-input"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputCustom
                          data-id="sign-in-password"
                          label={t("password")}
                          labelPlacement="inside"
                          required
                          type="password"
                          autoComplete="current-password"
                          {...field}
                          className="h-12 sm:h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.formState.errors.root && (
                  <div className="text-error">{form.formState.errors.root.message}</div>
                )}
                <div className="submit-container flex gap-2">
                  <Button
                    type="submit"
                    className="submit-button"
                    disabled={signInMutation.isPending}
                    data-testid="sign-in-button"
                  >
                    {signInMutation.isPending ? t("signingIn") : t("signIn")}
                  </Button>
                </div>
              </form>
            </Form>
            <div className="flex items-center justify-end mt-4 text-xs">
              <span className="mr-1">{t("notHaveAccount")}</span>
              <Link href="/sign-up" className="text-primary hover:underline">
                <span>{t("register")}</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="form-footer">
          <div>
            <LanguageSwitcher data-id="language-switch" />
          </div>
          <div className="legal-links">
            <Link href="/terms" className="hover:underline text-xs">
              {t("termsOfService")}
            </Link>
            <Link href="/policy" className="hover:underline text-xs">
              {t("privacyPolicy")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
