'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/app/context/AuthContext';
import { PasswordInput } from '@/components/ui-custom/PasswordInput';
import { toastError } from '@/components/ui-custom/Toast';
import { useRouter } from '@/lib/i18n';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import * as m from '@/paraglide/messages.js';
import { authChangePassword, AuthChangePasswordModel } from '@/dtos/auth.dto';

const ChangePasswordComponent = () => {
	const router = useRouter();
	const { accessToken } = useAuth();
	const token = accessToken || '';
	const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<AuthChangePasswordModel>({
		resolver: zodResolver(authChangePassword),
		defaultValues: {
			old_pass: '',
			new_pass: '',
			confirm_pass: '',
		},
	});

	const onSubmit = async (data: AuthChangePasswordModel) => {
		setIsLoading(true);
		try {
			const response = await fetch('/api/auth/change-password', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});
			const result = await response.json();
			if (result.error) {
				toastError({
					message: result.error.message || 'Failed to change password',
				});
			} else {
				setIsSuccessDialogOpen(true);
				form.reset();
			}
		} catch (error) {
			console.error('Password change error:', error);
			toastError({ message: 'Failed to change password' });
		} finally {
			setIsLoading(false);
		}
	};

	const backToSignIn = () => {
		localStorage.removeItem('access_token');
		localStorage.removeItem('tenant-id');
		localStorage.removeItem('user_data');
		router.push('/sign-in');
	};

	return (
		<>
			<div className="flex justify-center items-center my-10 md:my-20 px-4">
				<Card className="w-full max-w-lg shadow-lg border">
					<CardHeader>
						<CardTitle className="text-center text-lg font-semibold">
							{m.change_password_title()}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6"
							>
								<FormField
									control={form.control}
									name="old_pass"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm font-medium">
												{m.current_password_label()}
											</FormLabel>
											<FormControl>
												<PasswordInput
													placeholder={m.placeholder_current_password()}
													error={!!form.formState.errors.old_pass}
													{...field}
													className="h-9"
													disabled={isLoading}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="new_pass"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm font-medium">
												{m.new_password()}
											</FormLabel>
											<FormControl>
												<PasswordInput
													placeholder={m.placeholder_enter_new_password()}
													error={!!form.formState.errors.new_pass}
													{...field}
													className="h-9"
													disabled={isLoading}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="confirm_pass"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm font-medium">
												{m.confirm_new_password()}
											</FormLabel>
											<FormControl>
												<PasswordInput
													placeholder={m.placeholder_enter_confirm_new_password()}
													error={!!form.formState.errors.confirm_pass}
													{...field}
													className="h-9"
													disabled={isLoading}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									type="submit"
									className="w-full py-2 text-sm font-medium rounded-md"
									disabled={isLoading}
								>
									{isLoading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											{m.change_password()}...
										</>
									) : (
										<>{m.change_password()}</>
									)}
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>
			<Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{m.change_password_success()}</DialogTitle>
					</DialogHeader>
					<p className="text-sm text-muted-foreground">
						{m.change_password_detail_success()}
					</p>
					<DialogFooter>
						<Button onClick={backToSignIn}>{m.back_to_sign_in()}</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ChangePasswordComponent;
