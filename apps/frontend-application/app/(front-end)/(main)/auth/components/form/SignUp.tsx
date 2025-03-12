import { Separator } from '@/components/ui/separator'
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui-custom/FormCustom';
import { AuthFormType, EmailSchema, EmailType } from '@/lib/types';
import { InputCustom } from '@/components/ui-custom/InputCustom';
import SendEmailSuccess from '../SendEmailSucess';
import { sendVerificationEmail } from '@/services/auth';

interface Props {
    handleForm: (form: AuthFormType) => void;
}

const SignUp: React.FC<Props> = ({ handleForm }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    const form = useForm<EmailType>({
        resolver: zodResolver(EmailSchema),
        defaultValues: {
            email: "",
        },
    });

    const handleResendEmail = async () => {
        if (!userEmail || isLoading) return;

        setIsLoading(true);

        try {
            const result = await sendVerificationEmail(userEmail);
            if (result.error) {
                console.log(result.error);
            }
        } catch (error) {
            console.log(error instanceof Error ? error.message : 'Failed to resend email');
        } finally {
            setIsLoading(false);
        }
    };

    const onSignIn = () => {
        handleForm(AuthFormType.SignIn)
    }

    const onSubmit = async (data: EmailType) => {
        setIsLoading(true);
        try {
            const emailResult = await sendVerificationEmail(data.email);

            if (emailResult.error) {
                console.log(emailResult.error);
                return;
            }

            setUserEmail(data.email);
            setIsEmailSent(true);
            console.log('Verification email sent successfully!');
        } catch (error) {
            console.log(error instanceof Error ? error.message : 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {isEmailSent ? (
                <div className="w-full">
                    <SendEmailSuccess
                        email={userEmail}
                        onResend={handleResendEmail}
                        isResending={isLoading}
                    />
                    <p className='font-medium text-xs cursor-pointer mt-4 text-center' onClick={onSignIn}>
                        Back to Sign in
                    </p>
                </div>
            ) : (

                <>
                    <p className="text-[32px] font-bold">Create an account</p>
                    <p className="mb-2.5 mt-2.5 font-normal">
                        Enter your email below to create your account
                    </p>
                    <Separator className="my-4" />

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                required
                            />

                            <Button
                                type="submit"
                                className="w-full mt-4"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Sending...' : 'Sign Up'}
                            </Button>

                            <Separator className="my-4" />

                            <p className='font-medium text-xs cursor-pointer'>
                                By signing up, you are agreeing to our privacy policy, terms of use conditions.
                            </p>

                            <p
                                className='font-medium text-xs cursor-pointer'
                                onClick={onSignIn}
                            >
                                Have Account Already? Back to Sign in
                            </p>
                        </form>
                    </Form>
                </>
            )}
        </>
    );
}

export default SignUp