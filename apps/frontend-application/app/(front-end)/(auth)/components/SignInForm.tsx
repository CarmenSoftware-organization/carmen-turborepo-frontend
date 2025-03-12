'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SignInSchema, SignInType } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui-custom/FormCustom';
import { InputCustom } from '@/components/ui-custom/InputCustom';
import { PasswordInput } from '@/components/ui-custom/PasswordInput';
import { CustomButton } from '@/components/ui-custom/CustomButton';
import {
	handleSignInException,
	processLogin,
	signInAction,
} from '@/services/auth';
import { toastError } from '@/components/ui-custom/Toast';
import { useAuth } from '@/app/context/AuthContext';
import {
	des_signIn,
	password,
	sign_in_fail,
	signIn_title,
	username,
} from '@/paraglide/messages';
import { UserIcon, KeyIcon, ArrowRightIcon } from 'lucide-react';

const SignInForm = () => {
	const [loading, setLoading] = useState(false);
	const { handleLogin } = useAuth();

	const form = useForm<SignInType>({
		resolver: zodResolver(SignInSchema),
		defaultValues: {
			username: '',
			password: '',
		},
	});

	const onSubmit = async (data: SignInType) => {
		setLoading(true);
		try {
			const result = await signInAction(data);
			if (!result) {
				toastError({ message: sign_in_fail() });
			} else {
				await processLogin(result, handleLogin);
			}
		} catch (error) {
			handleSignInException(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full h-screen flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
					<div className="p-8">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6"
								data-id="sign-in-form"
							>
								<div className="text-center mb-6">
									<h1
										className="text-2xl font-bold text-gray-900 dark:text-white"
										data-id="sign-in-title"
									>
										{signIn_title()}
									</h1>
									<p
										className="mt-2 text-sm text-gray-600 dark:text-gray-400"
										data-id="sign-in-description"
									>
										{des_signIn()}
									</p>
								</div>

								<FormField
									control={form.control}
									name="username"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
												{username()}
											</FormLabel>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
													{!field.value && (
														<UserIcon className="h-5 w-5 text-gray-400" />
													)}
												</div>
												<FormControl>
													<InputCustom
														placeholder={username()}
														error={!!form.formState.errors.username}
														{...field}
														className={`h-11 rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${!field.value ? 'pl-10' : ''
															}`}
														disabled={loading}
														aria-label={username()}
														data-id="username-input"
													/>
												</FormControl>
											</div>
											<FormMessage className="text-xs" />
										</FormItem>
									)}
									required
								/>

								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
												{password()}
											</FormLabel>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
													{!field.value && (
														<KeyIcon className="h-5 w-5 text-gray-400" />
													)}
												</div>
												<FormControl>
													<PasswordInput
														placeholder={password()}
														error={!!form.formState.errors.password}
														{...field}
														className={`h-11 rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${!field.value ? 'pl-10' : ''
															}`}
														disabled={loading}
														aria-label={password()}
														data-id="password-input"
													/>
												</FormControl>
											</div>
											<FormMessage className="text-xs" />
										</FormItem>
									)}
									required
								/>

								<CustomButton
									type="submit"
									className="w-full h-11 mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
									loading={loading}
									disabled={loading}
									data-id="sign-in-button"
								>
									{signIn_title()}
									{!loading && <ArrowRightIcon />}
								</CustomButton>
							</form>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignInForm;
