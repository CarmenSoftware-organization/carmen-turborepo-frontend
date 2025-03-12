'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { formType } from '@/constants/enums';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { LoaderButton } from '@/components/ui-custom/button/LoaderButton';
import {
	ProductCategoryCreateModel,
	ProductCategoryCreateSchema,
} from '@/dtos/product-category.dto';
import { InputCustom } from '@/components/ui-custom/InputCustom';
import * as m from '@/paraglide/messages.js';

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: ProductCategoryCreateModel) => Promise<void>;
	initialData?: ProductCategoryCreateModel;
	mode: formType;
}

const CategoryDialog: React.FC<Props> = ({
	open,
	onOpenChange,
	onSubmit,
	initialData,
	mode,
}) => {
	const [isLoading, setIsLoading] = useState(false);

	const defaultValues: ProductCategoryCreateModel = {
		code: '',
		name: '',
		description: '',
		is_active: true,
	};

	const form = useForm<ProductCategoryCreateModel>({
		resolver: zodResolver(ProductCategoryCreateSchema),
		defaultValues:
			mode === formType.EDIT && initialData ? initialData : defaultValues,
	});

	useEffect(() => {
		if (mode === formType.EDIT && initialData) {
			form.reset(initialData);
		} else {
			form.reset(defaultValues);
		}
	}, [initialData, mode, form]);

	const handleSubmit = async (data: ProductCategoryCreateModel) => {
		setIsLoading(true);
		try {
			await onSubmit(data);
			onOpenChange(false);
		} catch (error) {
			console.error('Error submitting form:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		onOpenChange(false);
		form.reset();
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{mode === formType.ADD ? m.add_new_cat() : m.edit_cat()}
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4 py-4"
					>
						<FormField
							control={form.control}
							name="code"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{m.code_label()}</FormLabel>
									<FormControl>
										<InputCustom placeholder={m.code_label()} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{m.categories()}</FormLabel>
									<FormControl>
										<InputCustom placeholder={m.categories()} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{m.description()}</FormLabel>
									<FormControl>
										<Textarea
											placeholder={m.description()}
											{...field}
											className="placeholder:text-xs"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="is_active"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
									<div className="space-y-0.5">
										<FormLabel className="text-base">
											{m.status_active_text()}
										</FormLabel>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<div className="flex justify-end space-x-2">
							<Button
								type="button"
								variant={'outline'}
								onClick={handleClose}
								size={'sm'}
							>
								{m.cancel_text()}
							</Button>
							<LoaderButton
								type="submit"
								disabled={isLoading}
								isLoading={isLoading}
								size={'sm'}
							>
								{isLoading
									? `${m.saving()}...`
									: mode === formType.EDIT
										? `${m.save_change_text()}`
										: `${m.add_text()}`}
							</LoaderButton>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default CategoryDialog;
