"use client";

import { useAuth } from "@/context/AuthContext";
import { SignInFormValues, signInSchema } from "@/dtos/sign-in.dto";
import { useRouter } from "@/lib/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import "@/styles/auth.css";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import LanguageSwitch from "@/components/home-page/LanguageSwitch";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { toast } from "sonner";
import { signInService } from "@/services/auth.service";
import InputCustom from "@/components/ui-custom/InputCustom";

export default function SignInForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { setSession } = useAuth();
  const t = useTranslations("SignInPage");
  const tHome = useTranslations("HomePage");

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (values: SignInFormValues) => {
    startTransition(async () => {
      try {
        const result = await signInService(values.email, values.password);
        if (result) {
          if (result.access_token && result.refresh_token) {
            setSession(result.access_token, result.refresh_token);

            setTimeout(() => {
              router.push("/procurement/dashboard");
            }, 100);
          }
          form.reset();
        } else {
          form.setError("root", {
            message: result.message ?? t("signInError"),
          });
        }
      } catch (error) {
        console.error("Sign in error:", error);
        form.setError("root", {
          message: t("signInError"),
        });
        toast.error(t("signInError"));
      }
    });
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
            <p className="app-name">
              {tHome("CarmenSoftware")}
            </p>
            <p className="app-description">
              {tHome("HotelFinanceManagementSoftware")}
            </p>
          </div>

          <div className="login-form-wrapper">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  data-testid="email-input"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputCustom
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
                          label={t("password")}
                          labelPlacement="inside"
                          placeholder="This shows when input has value"
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
                  <div className="text-error">
                    {form.formState.errors.root.message}
                  </div>
                )}
                <div className="submit-container">
                  <Button
                    type="submit"
                    className="submit-button"
                    disabled={isPending}
                    data-testid="sign-in-button"
                  >
                    {isPending ? t("signingIn") : t("signIn")}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
        <div className="form-footer">
          <div>
            <LanguageSwitch data-id="language-switch" />
          </div>
          <div className="legal-links">
            <p>
              {t("termsOfService")}
            </p>
            <p>
              {t("privacyPolicy")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
