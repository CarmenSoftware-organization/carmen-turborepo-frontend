"use client"

import { SignInSchema } from '@/lib/types';
import React, { useState } from 'react'
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui-custom/FormCustom';
import { Separator } from '@/components/ui/separator';
import { InputCustom } from '@/components/ui-custom/InputCustom';
import { PasswordInput } from '@/components/ui-custom/PasswordInput';
import { useAuth } from '@/app/context/AuthContext';
import { CustomButton } from '@/components/ui-custom/CustomButton';
import * as m from '@/paraglide/messages.js';

const SignIn = () => {
	const { handleLogin } = useAuth();
	const [loading, setLoading] = useState(false);

	const form = useForm<z.infer<typeof SignInSchema>>({
		resolver: zodResolver(SignInSchema),
		defaultValues: {
			username: '',
			password: '',
		},
	});

	const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
		setLoading(true);
		try {
			console.log('Form data:', data);
			const response = await fetch('/api/auth/sign-in', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();
			if (!response.ok) {
				console.error('Signin failed:', result);
				return;
			}
			await handleLogin(
				{
					user: {
						id: result.id,
						username: result.username,
					},
					refresh_token: result.refresh_token,
					access_token: result.access_token,
					tenant: [
						{
							id: result.tenant?.id || '',
							name: result.tenant?.name || '',
							is_default: result.tenant?.is_default ?? false,
						},
					],
				},
				result.access_token
			);
		} catch (error) {
			console.error('Error during signin:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<p className="text-[32px] font-bold">{m.signIn_title()}</p>
			<p className="mb-2.5 mt-2.5 font-normal">{m.des_signIn()}</p>
			<Separator className="my-4" />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{m.username()}</FormLabel>
								<FormControl>
									<InputCustom
										placeholder={m.username()}
										error={!!form.formState.errors.username}
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
								<FormLabel>{m.password()}</FormLabel>
								<FormControl>
									<PasswordInput
										placeholder={m.password()}
										error={!!form.formState.errors.password}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
						required
					/>
					<CustomButton
						type="submit"
						className="w-full mt-4 h-10"
						loading={loading}
					>
						{m.signIn_title()}
					</CustomButton>
				</form>
			</Form>
			<Separator className="my-6" />
		</>
	);
};

export default SignIn
