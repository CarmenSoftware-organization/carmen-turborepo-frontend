"use client";

import { useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/context/AuthContext";

const signInSchema = z.object({
    email: z.string().email({ message: "Enter your email" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignIn() {
    const t = useTranslations();
    const { loginMutation } = useAuth();

    const schema = useMemo(() => signInSchema, []);
    const methods = useForm<SignInFormValues>({
        resolver: zodResolver(schema),
        defaultValues: { email: "", password: "" },
        mode: "onSubmit",
        reValidateMode: "onChange",
    });

    const handleSubmit = methods.handleSubmit((values) => {
        loginMutation.mutate(values);
    });

    return (
        <div className="min-h-screen flex items-center justify-between p-8 max-w-screen-lg mx-auto">
            <div className="space-y-4">
                <h1 className="text-5xl font-bold">{t("app.title")}</h1>
            </div>
            <div className="backdrop-blur-sm rounded-3xl p-8 w-[480px]">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-semibold">{t("app.login")}</h2>
                        <p className="text-gray-400">{t("app.welcome")}</p>
                    </div>

                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                            <div className="space-y-2">
                                <Label htmlFor="email">{t("auth.email")}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    inputMode="email"
                                    autoComplete="email"
                                    placeholder={t("auth.emailPlaceholder")}
                                    aria-label="email"
                                    tabIndex={0}
                                    {...methods.register("email")}
                                    className={cn("", {
                                        "border-red-500": !!methods.formState.errors.email,
                                    })}
                                />
                                {methods.formState.errors.email && (
                                    <p className="text-sm text-red-500" role="alert">
                                        {methods.formState.errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">{t("auth.password")}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    aria-label="password"
                                    tabIndex={0}
                                    {...methods.register("password")}
                                    className={cn("", {
                                        "border-red-500": !!methods.formState.errors.password,
                                    })}
                                />
                                {methods.formState.errors.password && (
                                    <p className="text-sm text-red-500" role="alert">
                                        {methods.formState.errors.password.message}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                aria-label="Sign in"
                                tabIndex={0}
                                disabled={loginMutation.isPending}
                                className="w-full"
                            >
                                {loginMutation.isPending ? t("app.loggingIn") : t("app.login")}
                            </Button>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </div>
    );
}