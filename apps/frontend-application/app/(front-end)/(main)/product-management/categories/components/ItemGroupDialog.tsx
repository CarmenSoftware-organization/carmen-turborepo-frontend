import { useAuth } from '@/app/context/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formType } from '@/constants/enums';
import { submitItemGroup } from '../actions/item_group';
import { toastError, toastSuccess } from '@/components/ui-custom/Toast';
import { LoaderButton } from '@/components/ui-custom/button/LoaderButton';
import {
	ProductItemGroupCreateModel,
	ProductItemGroupCreateSchema,
} from '@/dtos/product-item-group.dto';
import * as m from '@/paraglide/messages.js';
import { Label } from '@/components/ui/label';
import { InputCustom } from '@/components/ui-custom/InputCustom';

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	mode: formType;
	subcategory_id: string;
	subcategory_name?: string;
	setItemGroup: React.Dispatch<
		React.SetStateAction<ProductItemGroupCreateModel[]>
	>;
	itemGroup?: ProductItemGroupCreateModel | null;
}
const ItemGroupDialog: React.FC<Props> = ({
	open,
	mode,
	subcategory_id,
	subcategory_name,
	setItemGroup,
	itemGroup,
	onOpenChange,
}) => {
	const { accessToken } = useAuth();
	const token = accessToken || '';
	const [isLoading, setIsLoading] = useState(false);
	const defaultValues: ProductItemGroupCreateModel = {
		id: '',
		code: '',
		name: '',
		description: '',
		is_active: true,
		product_subcategory_id: subcategory_id,
	};

	const form = useForm<ProductItemGroupCreateModel>({
		resolver: zodResolver(ProductItemGroupCreateSchema),
		defaultValues:
			mode === formType.EDIT && itemGroup ? { ...itemGroup } : defaultValues,
	});

	useEffect(() => {
		if (mode === formType.EDIT && itemGroup) {
			form.reset(itemGroup);
		} else {
			form.reset(defaultValues);
		}
	}, [itemGroup, mode, form]);

	const handleSubmit = async (values: ProductItemGroupCreateModel) => {
		setIsLoading(true);
		const payload = {
			...values,
			product_subcategory_id: subcategory_id,
		};

		try {
			const response = await submitItemGroup(
				token,
				payload,
				mode,
				values.id || ''
			);
			if (!response) {
				toastError({ message: `Failed to ${mode} item group` });
			}

			if (mode === formType.ADD) {
				const newItemGroup = {
					...payload,
					id: response.id,
				};
				setItemGroup((prev: ProductItemGroupCreateModel[]) => [
					...prev,
					newItemGroup,
				]);
				toastSuccess({ message: 'Item group added successfully' });
			} else {
				setItemGroup((prev) =>
					prev.map((itemGroup) =>
						itemGroup.id === values.id
							? { ...payload, id: itemGroup.id }
							: itemGroup
					)
				);
				toastSuccess({ message: 'Item group updated successfully' });
			}
			handleClose();
		} catch (error) {
			console.error('Error submitting form:', error);
			toastError({ message: 'Failed to submit form' });
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
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{mode === formType.ADD ? m.add_itg() : m.edit_itg()}
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<Label>{m.sub_cattegory()}</Label>
						<Input
							placeholder={m.sub_cattegory()}
							defaultValue={subcategory_name}
							disabled
							className="text-xs"
						/>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{m.item_group()}</FormLabel>
									<FormControl>
										<InputCustom placeholder={m.item_group()} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
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

export default ItemGroupDialog;
