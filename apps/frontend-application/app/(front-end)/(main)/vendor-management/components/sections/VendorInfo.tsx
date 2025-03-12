import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui-custom/FormCustom';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import * as m from '@/paraglide/messages.js';
import { VendorCreateModel } from '@/dtos/vendor.dto';
import { Textarea } from '@/components/ui/textarea';

interface Props {
	form: UseFormReturn<VendorCreateModel>;
	isInputDisabled: boolean;
	onSubmit: (values: VendorCreateModel) => void;
}

const VendorInfo: React.FC<Props> = ({ form, isInputDisabled, onSubmit }) => {
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{m.Vendor()}</FormLabel>
							<FormControl>
								<Input
									{...field}
									disabled={isInputDisabled}
									placeholder="Enter vendor name"
									className='text-xs'
								/>
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
									{...field}
									disabled={isInputDisabled}
									placeholder="Enter vendor description"
									className='text-xs'
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
						<FormItem className="flex items-center space-x-2">
							<FormLabel>{m.status_text()}</FormLabel>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
									disabled={isInputDisabled}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
};

export default VendorInfo;
