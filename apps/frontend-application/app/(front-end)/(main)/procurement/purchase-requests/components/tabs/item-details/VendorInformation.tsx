import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { formType } from '@/constants/enums';

interface VendorInformationProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	form: UseFormReturn<any>;
	mode: formType;
	vendors: {
		name: string;
		id?: string;
		description?: string;
		is_active?: boolean;
	}[];
	getVendorNameById: (id: string) => string;
}

const VendorInformation: React.FC<VendorInformationProps> = ({
	form,
	mode,
	vendors,
	getVendorNameById,
}) => {
	return (
		<div>
			<h3 className="text-lg font-semibold mb-2">
				Vendor and Additional Information
			</h3>
			<div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
				<FormField
					control={form.control}
					name="vendor"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-xs text-muted-foreground">
								Vendor
							</FormLabel>
							{mode === formType.VIEW ? (
								<div className="mt-1">
									{getVendorNameById(field.value ?? '')}
								</div>
							) : (
								<Select value={field.value} onValueChange={field.onChange}>
									<FormControl>
										<SelectTrigger className="h-8">
											<SelectValue placeholder="Select vendor..." />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{vendors.map((vendor) => (
											<SelectItem key={vendor.id} value={vendor.id ?? ''}>
												{vendor.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="pricelistNumber"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-xs text-muted-foreground">
								Pricelist Number
							</FormLabel>
							{mode === formType.VIEW ? (
								<div className="mt-1">{field.value}</div>
							) : (
								<FormControl>
									<Input className="h-8" placeholder="Pricelist #" {...field} />
								</FormControl>
							)}
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
};

export default VendorInformation;
