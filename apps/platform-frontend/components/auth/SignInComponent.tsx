'use client';

import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import React, { useState, useId, useTransition } from 'react';
import { Loader, Eye, EyeOff } from 'lucide-react';

const SignInComponent = () => {
    const formId = useId();
    const { loginContext, loading, error: authError, getLoginForm } = useAuth();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = getLoginForm();
    const [isPending, startTransition] = useTransition();

    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = handleSubmit(async (data) => {
        // Use React 19's useTransition to improve UI responsiveness during login
        startTransition(async () => {
            try {
                await loginContext(data);
            } catch (err) {
                console.error('Login error:', err);
            }
        });
    });

    const isSubmittingForm = isSubmitting || isPending || loading;
    const hasFormErrors = Object.keys(errors).length > 0;
    const emailError = errors.email?.message;
    const passwordError = errors.password?.message;

    return (
        <div className="min-h-screen flex items-center justify-between p-8 max-w-screen-lg mx-auto">
            {/* Left Section */}
            <div className="text-white space-y-4">
                <h1 className="text-5xl font-bold">Carmen Platform</h1>
            </div>

            {/* Right Section - Login Form */}
            <div className="backdrop-blur-sm rounded-3xl p-8 w-[480px] text-white">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-semibold">Login</h2>
                        <p className="text-gray-400">Welcome to Carmen Platform</p>
                    </div>

                    {(authError || hasFormErrors) && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-500" role="alert">
                            {authError ?? emailError ?? passwordError}
                        </div>
                    )}

                    <form id={formId} onSubmit={handleLogin} className="space-y-6" noValidate>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor={`${formId}-email`} className="block text-sm font-medium mb-2">
                                    Email
                                </label>
                                <input
                                    id={`${formId}-email`}
                                    type="email"
                                    aria-invalid={errors.email ? "true" : "false"}
                                    aria-describedby={errors.email ? `${formId}-email-error` : undefined}
                                    className="w-full border border-zinc-700 bg-zinc-900/50 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                    placeholder="Enter your email"
                                    {...register('email')}
                                    autoComplete="email"
                                />
                                {errors.email && (
                                    <p id={`${formId}-email-error`} className="mt-1 text-sm text-red-500" role="alert">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label htmlFor={`${formId}-password`} className="block text-sm font-medium mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id={`${formId}-password`}
                                        type={showPassword ? 'text' : 'password'}
                                        aria-invalid={errors.password ? "true" : "false"}
                                        aria-describedby={errors.password ? `${formId}-password-error` : undefined}
                                        className="w-full border border-zinc-700 bg-zinc-900/50 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                        placeholder="Enter your password"
                                        {...register('password')}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:text-white transition cursor-pointer"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                setShowPassword(!showPassword);
                                            }
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p id={`${formId}-password-error`} className="mt-1 text-sm text-red-500" role="alert">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id={`${formId}-remember-me`}
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900/50 text-primary focus:ring-primary"
                                    {...register('rememberMe')}
                                />
                                <label htmlFor={`${formId}-remember-me`} className="ml-2 block text-sm">
                                    Remember me
                                </label>
                            </div>
                            <div className="text-sm">
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-primary hover:text-primary/80 focus:text-primary/80 outline-none focus:underline"
                                    tabIndex={0}
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmittingForm}
                            className="cursor-pointer w-full font-medium py-2.5 px-4 rounded-lg flex justify-center items-center border border-primary hover:bg-primary/90 focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:outline-none transition disabled:opacity-50 disabled:pointer-events-none"
                            aria-busy={isSubmittingForm}
                        >
                            {isSubmittingForm ? (
                                <>
                                    <Loader className="animate-spin mr-2 h-4 w-4" />
                                    Signing in...
                                </>
                            ) : 'Sign in'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignInComponent