'use client';

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/app/context/AuthContext';
import { formType } from '@/constants/enums';
import { toastError, toastSuccess } from '@/components/ui-custom/Toast';
import { submitSubCategory } from '../actions/sub_category';
import { LoaderButton } from '@/components/ui-custom/button/LoaderButton';
import {
	ProductSubCategoryCreateModel,
	ProductSubCategoryCreateSchema,
} from '@/dtos/product-sub-category.dto';
import * as m from '@/paraglide/messages.js';
import { InputCustom } from '@/components/ui-custom/InputCustom';
import { Label } from '@/components/ui/label';

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	mode: formType;
	product_category_id: string;
	product_category_name?: string;
	setSubProducts: React.Dispatch<
		React.SetStateAction<ProductSubCategoryCreateModel[]>
	>;
	subCategory?: ProductSubCategoryCreateModel | null;
}

const SubCatDialog: React.FC<Props> = ({
	open,
	product_category_id,
	product_category_name,
	mode,
	onOpenChange,
	setSubProducts,
	subCategory,
}) => {
	const { accessToken } = useAuth();
	const token = accessToken || '';
	const [isLoading, setIsLoading] = useState(false);

	const formValues: ProductSubCategoryCreateModel = {
		id: '',
		name: '',
		description: '',
		is_active: true,
		product_category_id: product_category_id,
	};

	const form = useForm<ProductSubCategoryCreateModel>({
		resolver: zodResolver(ProductSubCategoryCreateSchema),
		defaultValues:
			mode === formType.EDIT && subCategory ? { ...subCategory } : formValues,
	});

	useEffect(() => {
		if (mode === formType.EDIT && subCategory) {
			form.reset({ ...subCategory });
		} else {
			form.reset({ ...formValues });
		}
	}, [subCategory, mode]);

	const handleSubmit = async (values: ProductSubCategoryCreateModel) => {
		setIsLoading(true);
		const payload = {
			...values,
			product_category_id: product_category_id,
		};

		try {
			const response = await submitSubCategory(
				payload,
				token,
				mode,
				subCategory?.id || ''
			);

			if (!response) {
				toastError({ message: `Failed to ${mode} sub-category` });
			}

			if (mode === formType.ADD) {
				const newSubCategory = {
					...payload,
					id: response.id,
				};
				setSubProducts((prev: ProductSubCategoryCreateModel[]) => [
					...prev,
					newSubCategory,
				]);
				toastSuccess({ message: 'Sub-category added successfully' });
			} else {
				setSubProducts((prev) =>
					prev.map((subProduct) =>
						subProduct.id === values.id
							? { ...payload, id: subProduct.id }
							: subProduct
					)
				);
				toastSuccess({ message: 'Sub-category updated successfully' });
			}

			handleClose();
		} catch (error) {
			console.error(`Error ${mode}ing sub-category:`, error);
			toastError({ message: `Failed to ${mode} sub-category` });
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		form.reset();
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						{mode === formType.ADD ? m.add_sub_cat() : m.edit_sub_cat()}
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<Label>{m.categories()}</Label>
						<Input
							placeholder="Enter name"
							defaultValue={product_category_name}
							className="text-xs"
							disabled
						/>
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
									<FormLabel>{m.sub_cattegory()}</FormLabel>
									<FormControl>
										<InputCustom placeholder={m.sub_cattegory()} {...field} />
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
									<FormLabel className="text-base">
										{m.status_active_text()}
									</FormLabel>
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

export default SubCatDialog;
