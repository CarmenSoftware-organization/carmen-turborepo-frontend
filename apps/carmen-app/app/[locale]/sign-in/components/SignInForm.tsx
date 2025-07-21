"use client";

import { useAuth } from "@/context/AuthContext";
import { SignInFormValues, signInSchema } from "@/dtos/sign-in.dto";
import { useRouter } from "@/lib/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
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

            // รอเล็กน้อยเพื่อให้ AuthContext ประมวลผล token ก่อน redirect
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
    <div className="flex justify-center items-center w-full min-h-screen bg-muted p-4 sm:p-0">
      <div className="bg-background max-w-4xl w-full p-6 sm:p-10 rounded-xl">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 space-y-4 mb-8 lg:mb-0 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <Image
                src="/images/carmen_pic.jpg"
                alt="@shadcn"
                className="rounded-full"
                width={60}
                height={60}
                data-id="sidebar-logo-avatar-image"
              />
            </div>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
              {tHome("CarmenSoftware")}
            </p>
            <p className="text-muted-foreground text-sm sm:text-base font-normal">
              {tHome("HotelFinanceManagementSoftware")}
            </p>
          </div>

          <div className="w-full lg:w-1/2 lg:pt-10">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
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
                  <div className="text-sm font-medium text-destructive">
                    {form.formState.errors.root.message}
                  </div>
                )}
                <div className="flex justify-center sm:justify-end pt-2">
                  <Button
                    type="submit"
                    className="w-full sm:w-40 h-12 sm:h-10 bg-primary hover:bg-primary/80 text-white rounded-full"
                    disabled={isPending}
                  >
                    {isPending ? t("signingIn") : t("signIn")}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 lg:mt-10 gap-4 sm:gap-0">
          <div className="order-2 sm:order-1">
            <LanguageSwitch />
          </div>
          <div className="flex items-center gap-4 text-center order-1 sm:order-2">
            <p className="text-muted-foreground text-xs">
              {t("termsOfService")}
            </p>
            <p className="text-muted-foreground text-xs">
              {t("privacyPolicy")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
