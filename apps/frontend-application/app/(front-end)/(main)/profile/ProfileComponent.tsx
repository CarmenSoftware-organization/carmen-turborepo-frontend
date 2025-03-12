'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera as CameraIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/app/context/AuthContext';
import { AvailableLanguageTag } from '@/paraglide/runtime';
import { usePathname, useRouter } from '@/lib/i18n';
import { Route } from 'next';
import { useParams } from 'next/navigation';
import * as m from '@/paraglide/messages.js';

const profileFormSchema = z.object({
	username: z.string(),
	email: z.string().email(),
	firstName: z.string().min(2),
	lastName: z.string().min(2),
	language: z.string(),
	timezone: z.string(),
	avatar: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileComponent = () => {
	const { authState } = useAuth();

	const fileInputRef = useRef<HTMLInputElement>(null);
	const [avatarPreview, setAvatarPreview] = useState<string>(
		'https://avatars.githubusercontent.com/u/80618380?s=400&u=8e4d51a3c01b8e3709f141cdd3e84a85a0b0cdcc&v=4'
	);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const pathname = usePathname() as Route;
	const router = useRouter();
	const params = useParams();
	const currentLocale = params.locale as AvailableLanguageTag;

	const labels: Record<AvailableLanguageTag, string> = {
		'en-us': 'English',
		'th-th': 'ไทย',
	};

	const setLanguage = (lang: AvailableLanguageTag) => {
		router.push(pathname, {
			locale: lang,
		});
	};

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileFormSchema),
		defaultValues: {
			username: 'johndoe',
			email: authState.user?.username,
			firstName: 'John',
			lastName: 'Doe',
			language: labels[currentLocale],
			timezone: 'UTC',
			avatar:
				'https://avatars.githubusercontent.com/u/80618380?s=400&u=8e4d51a3c01b8e3709f141cdd3e84a85a0b0cdcc&v=4',
		},
	});

	const roles = ['User', 'Manager'];
	const businessUnits = ['HQ', 'Branch 1', 'Branch 2'];

	const onSubmit = (data: ProfileFormValues) => {
		console.log(data);
		// Handle form submission
	};

	const handleAvatarClick = () => {
		setIsDialogOpen(true);
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith('image/')) {
			alert('Please upload an image file');
			return;
		}

		const reader = new FileReader();
		reader.onloadend = () => {
			const base64String = reader.result as string;
			setAvatarPreview(base64String);
			form.setValue('avatar', base64String);
			setIsDialogOpen(false);
		};
		reader.readAsDataURL(file);
	};

	return (
		<Card className="p-4 bg-background m-6">
			<CardHeader>
				<CardTitle className="text-3xl font-bold">{m.edit_profile_title()}</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<div className="flex items-center space-x-4">
							<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
								<DialogTrigger asChild>
									<Avatar
										className="w-24 h-24 cursor-pointer hover:opacity-80 transition-opacity"
										role="button"
										tabIndex={0}
										onClick={handleAvatarClick}
										onKeyDown={(e) => e.key === 'Enter' && handleAvatarClick()}
										aria-label="Click to change avatar"
									>
										<AvatarImage
											src={avatarPreview || ''}
											alt={form.getValues('username')}
										/>
										<AvatarFallback>
											{form.getValues('firstName')[0]}
											{form.getValues('lastName')[0]}
										</AvatarFallback>
									</Avatar>
								</DialogTrigger>
								<DialogContent className="sm:max-w-md">
									<DialogHeader>
										<DialogTitle>{m.change_profile_picture()}</DialogTitle>
										<DialogDescription>
											{m.change_profile_pic_des()}
										</DialogDescription>
									</DialogHeader>
									<div className="flex flex-col items-center space-y-4 py-4">
										<Avatar className="w-40 h-40">
											<AvatarImage
												src={avatarPreview || ''}
												alt={form.getValues('username')}
											/>
											<AvatarFallback>
												{form.getValues('firstName')[0]}
												{form.getValues('lastName')[0]}
											</AvatarFallback>
										</Avatar>
										<div className="flex items-center gap-2">
											<Button
												size={'sm'}
												onClick={() => fileInputRef.current?.click()}
											>
												<CameraIcon className="w-4 h-4" />
												{m.choose_image()}
											</Button>
											<Button
												size={'sm'}
												variant="outline"
												onClick={() => setIsDialogOpen(false)}
											>
												{m.cancel_text()}
											</Button>
										</div>
									</div>
								</DialogContent>
							</Dialog>

							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								className="hidden"
								onChange={handleFileChange}
								aria-label="Upload avatar image"
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{m.username()}</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{m.email()}</FormLabel>
										<FormControl>
											<Input {...field} type="email" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{m.first_name()}</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="lastName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{m.last_name()}</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="space-y-2">
								<Label>{m.role_text()}</Label>
								<div className="flex flex-wrap gap-2">
									{roles.map((role) => (
										<Badge
											key={role}
											variant="secondary"
											className="bg-blue-100 text-blue-800"
										>
											{role}
										</Badge>
									))}
								</div>
							</div>

							<div className="space-y-2">
								<Label>{m.business_unit_text()}</Label>
								<div className="flex flex-wrap gap-2">
									{businessUnits.map((unit) => (
										<Badge
											key={unit}
											variant="secondary"
											className="bg-blue-100 text-blue-800"
										>
											{unit}
										</Badge>
									))}
								</div>
							</div>

							<FormField
								control={form.control}
								name="language"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{m.langauge_text()}</FormLabel>
										<Select
											onValueChange={(value: AvailableLanguageTag) => {
												field.onChange(labels[value]);
												setLanguage(value);
											}}
											value={currentLocale}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a language">
														{labels[currentLocale]}
													</SelectValue>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{(
													Object.entries(labels) as [
														AvailableLanguageTag,
														string,
													][]
												).map(([value, label]) => (
													<SelectItem key={value} value={value}>
														{label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="timezone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{m.time_zone_text()}</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a timezone" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="UTC">UTC</SelectItem>
												<SelectItem value="EST">EST</SelectItem>
												<SelectItem value="PST">PST</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="flex justify-end gap-2">
							<Button asChild size={'sm'} variant={'outline'}>
								<Link href="/profile/change-password">{m.change_password()}</Link>
							</Button>
							<Button type="submit" size={'sm'}>{m.save_text()}</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

export default ProfileComponent;
