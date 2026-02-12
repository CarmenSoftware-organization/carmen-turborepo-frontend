"use client";

import { useAuth } from "@/context/AuthContext";
import { SignInFormValues, createSignInSchema } from "@/dtos/sign-in.dto";
import { Link, useRouter } from "@/lib/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
    <div className="flex justify-center items-center w-full min-h-screen bg-muted p-4 sm:p-0">
      <div className="bg-background max-w-4xl w-full p-6 sm:p-10 rounded-lg">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 space-y-4 mb-8 lg:mb-0 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <Image
                src="/images/carmen_pic.jpg"
                alt="Carmen Software"
                className="rounded-full"
                width={60}
                height={60}
                data-id="sidebar-logo-avatar-image"
              />
            </div>
            <p className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight">
              {tHome("CarmenSoftware")}
            </p>
            <p className="text-muted-foreground text-sm sm:text-base font-normal">
              {tHome("HotelFinanceManagementSoftware")}
            </p>
          </div>

          <div className="w-full lg:w-1/2 lg:pt-10">
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
                          placeholder=""
                          required
                          autoComplete="username"
                          {...field}
                          className="h-10 sm:h-9"
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
                          className="h-10 sm:h-9"
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
                <div className="flex justify-center sm:justify-end pt-2 gap-2">
                  <Button
                    type="submit"
                    className="w-full h-10 sm:h-9"
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
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 lg:mt-10 gap-4 sm:gap-0">
          <div className="order-2 sm:order-1">
            <LanguageSwitcher data-id="language-switch" />
          </div>
          <div className="flex items-center gap-4 text-center order-1 sm:order-2">
            <Link href="/terms" className="text-muted-foreground hover:underline text-xs">
              {t("termsOfService")}
            </Link>
            <Link href="/policy" className="text-muted-foreground hover:underline text-xs">
              {t("privacyPolicy")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
