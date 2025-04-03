"use client";

import { signInSchema } from "@/constants/form.schema";
import { useAuth } from "@/context/AuthContext";
import { SignInFormValues } from "@/dtos/sign-in.dto";
import { useRouter } from "@/lib/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { signInAction } from "../actions";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/ui-custom/PasswordInput"
import LanguageSwitch from "@/components/home-page/LanguageSwitch";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { toast } from "sonner";

export default function SignInForm() {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const { setSession } = useAuth()
    const t = useTranslations('SignInPage');
    const tHome = useTranslations('HomePage');

    const form = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const handleSubmit = (values: SignInFormValues) => {
        startTransition(async () => {
            try {
                const result = await signInAction(values.email, values.password)

                if (result.success) {
                    if (result.access_token && result.refresh_token) {
                        setSession(result.access_token, result.refresh_token)
                    }

                    router.push('/procurement/my-approval')
                    form.reset()
                } else {
                    form.setError("root", {
                        message: result.message ?? t('signInError')
                    })
                }
            } catch (error) {
                console.error("Sign in error:", error)
                form.setError("root", {
                    message: t('signInError')
                })
                toast.error(t('signInError'))
            }
        })
    }
    return (
        <div className="flex justify-center items-center w-full min-h-screen bg-muted">
            <div className="bg-background max-w-4xl w-full p-10 rounded-xl">
                <div className="flex">
                    <div className="w-1/2 space-y-4">
                        <Image
                            src="/images/carmen_pic.jpg"
                            alt="@shadcn"
                            className="rounded-full"
                            width={80}
                            height={80}
                            data-id="sidebar-logo-avatar-image"
                        />
                        <p className="text-4xl font-semibold">
                            {tHome('CarmenSoftware')}
                        </p>
                        <p className="text-muted-foreground text-sm">
                            {tHome('HotelFinanceManagementSoftware')}
                        </p>
                    </div>

                    <div className="w-1/2 pt-10">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('email')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="email@example.com"
                                                    type="email"
                                                    autoComplete="email"
                                                    disabled={isPending}
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
                                            <FormLabel>{t('password')}</FormLabel>
                                            <FormControl>
                                                <PasswordInput
                                                    placeholder="••••••••"
                                                    type="password"
                                                    autoComplete="current-password"
                                                    disabled={isPending}
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
                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        className="w-40 h-10 bg-blue-700 hover:bg-blue-600 text-white rounded-full"
                                        disabled={isPending}
                                    >
                                        {isPending ? t('signingIn') : t('signIn')}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
                <p className="text-muted-foreground text-sm mt-10">
                    <LanguageSwitch />
                </p>
            </div>
        </div>
    )
}
