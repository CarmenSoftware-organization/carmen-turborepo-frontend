"use client"

import React, { useState } from 'react'

interface CustomJwtPayload {
    username: string;
    email: string;
}
import { jwtDecode } from "jwt-decode";
import { useRouter } from '@/lib/i18n';
import { InputCustom } from '@/components/ui-custom/InputCustom';
import { PasswordInput } from '@/components/ui-custom/PasswordInput';
import { CustomButton } from '@/components/ui-custom/CustomButton';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { PayloadRecoverPasswordType, RecoverPasswordSchema, RecoverPasswordType } from '@/lib/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui-custom/FormCustom';
import { submitForgotPassword } from '@/services/auth';

interface Props {
    token: string;
}

const PasswordRecovery: React.FC<Props> = ({ token }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const decoded = jwtDecode<CustomJwtPayload>(token);

    const form = useForm<RecoverPasswordType>({
        resolver: zodResolver(RecoverPasswordSchema),
        defaultValues: {
            username: decoded?.username,
            email: decoded?.email,
            password: "",
            confirmPassword: "",
            emailToken: token,
        },
    });

    const onSubmit = async (data: RecoverPasswordType) => {
        setLoading(true)

        try {
            const payload: PayloadRecoverPasswordType = {
                username: data.email,
                email: data.email,
                password: data.password,
                emailToken: token,
            };

            const { success, message } = await submitForgotPassword(payload);

            if (success) {
                router.push("/auth");
            } else {
                console.error('Forgot password failed:', message);
            }

        } catch (error) {
            console.error('Error during signin:', error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex flex-col justify-center items-center'>
            <div className='my-auto mb-auto mt-8 flex flex-col max-w-[450px]'>
                <div className='my-2'>
                    <h2 className="text-2xl font-bold">Reset Your Password</h2>
                    <p className="text-gray-600 mt-2 text-xs">
                        Please fill out the form below to verify your account information and complete the reset process.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <InputCustom
                                            placeholder="Email"
                                            type="email"
                                            error={!!form.formState.errors.email}
                                            {...field}
                                            disabled
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            required
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            placeholder="Password"
                                            error={!!form.formState.errors.password}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            required
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            placeholder="Confirm Password"
                                            error={!!form.formState.errors.confirmPassword}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            required
                        />

                        <CustomButton type="submit" className="w-full mt-4" loading={loading}>
                            Sign up
                        </CustomButton>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default PasswordRecovery