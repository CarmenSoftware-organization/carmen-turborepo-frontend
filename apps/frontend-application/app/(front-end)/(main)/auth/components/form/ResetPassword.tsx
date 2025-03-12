import { Separator } from '@/components/ui/separator';
import React from 'react';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui-custom/FormCustom';
import { AuthFormType } from '@/lib/types';
import { InputCustom } from '@/components/ui-custom/InputCustom';

interface Props {
    handleForm: (form: AuthFormType) => void;
}

const ResetPasswordSchema = z.object({
    email: z.string().email(),
});

const ResetPassword: React.FC<Props> = ({ handleForm }) => {
    const form = useForm<z.infer<typeof ResetPasswordSchema>>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = (data: z.infer<typeof ResetPasswordSchema>) => {
        console.log("Reset Password data:", data);
        // Add the reset password handling logic here
    }

    const onSignIn = () => {
        handleForm(AuthFormType.SignIn)
    }

    return (
        <>
            <p className="text-[32px] font-bold">Reset Password</p>
            <p className="mb-2.5 mt-2.5 font-normal">Enter your email</p>
            <Separator className="my-4" />
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
                                        type='email'
                                        placeholder="Email"
                                        error={!!form.formState.errors.email}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        required
                    />
                    <Button type="submit" className="w-full mt-4">
                        Reset Password
                    </Button>
                    <Separator className="my-4" />
                    <p className='font-medium text-xs cursor-pointer' onClick={onSignIn}>Back to Sign in</p>
                </form>
            </Form>
        </>
    );
}

export default ResetPassword;
