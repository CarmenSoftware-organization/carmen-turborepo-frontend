"use client"

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { PayloadVerifyType, VerifySchema, VerifyType } from '@/lib/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui-custom/FormCustom';
import { InputCustom } from '@/components/ui-custom/InputCustom';
import { PasswordInput } from '@/components/ui-custom/PasswordInput';
import { CustomButton } from '@/components/ui-custom/CustomButton';
import { Checkbox } from '@/components/ui/checkbox';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useRouter } from '@/lib/i18n';
import { submitSignup } from '@/services/auth';

interface Props {
    token: string;
}

interface CustomJwtPayload extends JwtPayload {
    email?: string;
    username?: string
}

const VerifyComponent: React.FC<Props> = ({ token }) => {
    const [loading, setLoading] = useState(false);
    const decoded = jwtDecode<CustomJwtPayload>(token);
    const router = useRouter();

    const form = useForm<VerifyType>({
        resolver: zodResolver(VerifySchema),
        defaultValues: {
            username: decoded?.username,
            email: decoded?.email,
            password: "",
            confirmPassword: "",
            emailToken: token,
            consent: false,
            userInfo: {
                firstName: "",
                middleName: "",
                lastName: ""
            }
        },
    });

    const onSubmit = async (data: VerifyType) => {
        setLoading(true)

        try {
            const payload: PayloadVerifyType = {
                username: data.email,
                email: data.email,
                password: data.password,
                emailToken: token,
                consent: data.consent,
                userInfo: {
                    firstName: data.userInfo.firstName,
                    middleName: data.userInfo.middleName,
                    lastName: data.userInfo.lastName
                }
            };

            const { success, message } = await submitSignup(payload);

            if (success) {
                router.push("/dashboard");
            } else {
                console.error('Signup failed:', message);
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
                    <h2 className="text-2xl font-bold">Verify Your Account</h2>
                    <p className="text-gray-600 mt-2 text-xs">
                        Please fill out the form below to verify your account information and complete the registration process.
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
                            name="userInfo.firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First name</FormLabel>
                                    <FormControl>
                                        <InputCustom
                                            placeholder="First Name"
                                            error={!!form.formState.errors.userInfo?.firstName}
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
                            name="userInfo.middleName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Middle Name</FormLabel>
                                    <FormControl>
                                        <InputCustom
                                            placeholder="Middle Name"
                                            error={!!form.formState.errors.userInfo?.middleName}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="userInfo.lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last name</FormLabel>
                                    <FormControl>
                                        <InputCustom
                                            placeholder="Last Name"
                                            error={!!form.formState.errors.userInfo?.lastName}
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

                        <FormField
                            control={form.control}
                            name="consent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex items-start">
                                            <Checkbox
                                                id="consent"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                            <label htmlFor="consent" className="ml-2 text-sm text-gray-600">
                                                I agree to the <a href="#" className="text-blue-500 underline">terms and conditions</a>.
                                            </label>
                                        </div>
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

export default VerifyComponent