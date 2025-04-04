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
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useTransition, useEffect, useState } from "react";
import { PasswordInput } from "./ui-custom/PasswordInput";
import { signInService } from "@/services/auth.service";


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
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [currentPath, setCurrentPath] = useState<string>('');
    const t = useTranslations('SignInPage');
    const [isPending, startTransition] = useTransition();

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
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleSubmit = (values: SignInFormValues) => {
        startTransition(async () => {
            try {
                const result = await signInService(values.email, values.password)

                if (result) {
                    if (result.access_token && result.refresh_token) {
                        setSession(result.access_token, result.refresh_token)
                    }

                    // กลับไปที่ path เดิมแทนที่จะไป dashboard
                    router.push(currentPath || '/dashboard')
                    form.reset()
                    onOpenChange(false)
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