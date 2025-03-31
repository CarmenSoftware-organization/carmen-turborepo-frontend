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
import { signInSchema } from "@/constants/form.schema";
import { SignInFormValues } from "@/dtos/sign-in.dto";
import { signInAction } from "@/app/[locale]/sign-in/actions";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { PasswordInput } from "./ui-custom/PasswordInput";


interface Props {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
}

export default function SignInDialog({
    open,
    onOpenChange,
}: Props) {
    const { setSession } = useAuth();
    const router = useRouter();
    const t = useTranslations('SignInPage');
    const [isPending, startTransition] = useTransition();

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
                const result = await signInAction(values.email, values.password)

                if (result.success) {
                    if (result.access_token && result.refresh_token) {
                        setSession(result.access_token, result.refresh_token)
                    }

                    router.push('/dashboard')
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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Session Expired</DialogTitle>
                    <DialogDescription>
                        Please sign in again to continue.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
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
                                    <FormLabel>Password</FormLabel>
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

                        <DialogFooter>
                            <Button
                                type="submit"
                                className="w-40 h-10 bg-primary hover:bg-primary/90 text-white rounded-full"
                                disabled={isPending}
                            >
                                {isPending ? t('signingIn') : t('signIn')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
} 