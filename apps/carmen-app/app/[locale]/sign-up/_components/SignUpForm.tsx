"use client";

import { Link, useRouter } from "@/lib/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { toast } from "sonner";
import { useSignUpMutation } from "@/hooks/use-auth-query";
import { Input } from "@/components/ui/input";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { createSignUpSchema, SignUpFormValues, mapFormToPayload } from "@/dtos/sign-up.dto";
import InputCustom from "@/components/ui-custom/InputCustom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form-custom/form";

export default function SignUpForm() {
  const router = useRouter();
  const t = useTranslations("SignUpPage");
  const tHome = useTranslations("HomePage");

  const signUpMutation = useSignUpMutation();

  const signUpSchema = createSignUpSchema(t);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      middleName: "",
      lastName: "",
      telephone: "",
    },
  });

  const handleSubmit = (values: SignUpFormValues) => {
    const payload = mapFormToPayload(values);

    signUpMutation.mutate(payload, {
      onSuccess: () => {
        toast.success(t("signUpSuccess"));
        form.reset();
        router.push("/sign-in");
      },
      onError: (error) => {
        console.error("Sign up error:", error);
        form.setError("root", {
          message: t("signUpError"),
        });
        toast.error(t("signUpError"));
      },
    });
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-muted p-4 sm:p-0">
      <div className="bg-background max-w-xl w-full p-6 sm:p-10 rounded-xl">
        <div className="flex flex-col items-center text-center mb-4">
          <Image
            src="/images/carmen_pic.jpg"
            alt="Carmen Logo"
            className="rounded-full"
            width={60}
            height={60}
            data-id="sidebar-logo-avatar-image"
          />
          <p className="text-2xl sm:text-3xl font-semibold mt-4">{tHome("CarmenSoftware")}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="username"
                required
                data-id="sign-up-username-input"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("username")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("username")}
                        autoComplete="username"
                        {...field}
                        className="h-8"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                required
                data-id="sign-up-email-input"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("email")}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        autoComplete="email"
                        {...field}
                        className="h-8"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                required
                data-id="sign-up-first-name-input"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("firstName")}</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-8" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                required
                data-id="sign-up-last-name-input"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("lastName")}</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-8" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("middleName")}{" "}
                      <span className="text-muted-foreground text-xs">{t("optional")}</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="h-8" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telephone"
                required
                data-id="sign-up-telephone-input"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("telephone")}</FormLabel>
                    <FormControl>
                      <Input type="tel" autoComplete="tel" {...field} className="h-8" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputCustom
                        label={t("password")}
                        required
                        type="password"
                        autoComplete="current-password"
                        {...field}
                        className="h-8"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <InputCustom
                      label={t("confirmPassword")}
                      required
                      type="password"
                      autoComplete="current-password"
                      {...field}
                      className="h-8"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {form.formState.errors.root && (
              <div className="text-sm font-medium text-destructive">
                {form.formState.errors.root.message}
              </div>
            )}

            <div className="flex justify-center sm:justify-end pt-2">
              <Button
                type="submit"
                className="w-full sm:w-40 h-12 sm:h-10 bg-primary hover:bg-primary/80 text-white rounded-full"
                disabled={signUpMutation.isPending}
              >
                {signUpMutation.isPending ? t("signingUp") : t("signUp")}
              </Button>
            </div>
          </form>
        </Form>

        <div className="flex items-center justify-end mt-4 text-xs">
          <span className="mr-1">{t("alreadyHaveAccount")}</span>
          <Link href="/sign-in" className="text-primary hover:underline">
            <span>{t("signIn")}</span>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4 sm:gap-0">
          <div className="order-2 sm:order-1">
            <LanguageSwitcher data-id="language-switch" />
          </div>
          <div className="flex items-center gap-4 text-center order-1 sm:order-2">
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
