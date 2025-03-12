import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { formType } from '@/constants/enums';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface PricingInformationProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	form: UseFormReturn<any>;
	mode: formType;
	currencies?: { id: string; code: string; name: string }[];
}

const PricingInformation: React.FC<PricingInformationProps> = ({
	form,
	mode,
	currencies,
}) => {

	useEffect(() => {
		const price = form.watch('price') || 0;
		const quantity = form.watch('quantityRequested') || 0;
		const netAmount = price * quantity;
		form.setValue('netAmount', netAmount);
		calculateTotal();
	}, [form.watch('price'), form.watch('quantityRequested')]);

	// Calculate discount and tax amounts when rates change
	useEffect(() => {
		calculateTotal();
	}, [
		form.watch('netAmount'),
		form.watch('discountRate'),
		form.watch('taxRate'),
		form.watch('adjustments.discount'),
		form.watch('adjustments.tax'),
		form.watch('taxIncluded'),
	]);

	const calculateTotal = () => {
		const netAmount = form.watch('netAmount') || 0;
		const discountRate = form.watch('discountRate') || 0;
		const taxRate = form.watch('taxRate') || 0;
		const applyDiscount = form.watch('adjustments.discount') || false;
		const applyTax = form.watch('adjustments.tax') || false;
		const taxIncluded = form.watch('taxIncluded') || false;

		let discountAmount = 0;
		let taxAmount = 0;
		let totalAmount = netAmount;

		// Calculate discount if applicable
		if (applyDiscount) {
			discountAmount = (netAmount * discountRate) / 100;
			totalAmount = netAmount - discountAmount;
		}

		// Calculate tax if applicable
		if (applyTax) {
			if (taxIncluded) {
				// Tax is already included in the price
				taxAmount = (totalAmount * taxRate) / (100 + taxRate);
			} else {
				// Tax is added to the price
				taxAmount = (totalAmount * taxRate) / 100;
				totalAmount += taxAmount;
			}
		}

		form.setValue('discountAmount', discountAmount);
		form.setValue('taxAmount', taxAmount);
		form.setValue('totalAmount', totalAmount);
	};

	return (
		<div>
			<h3 className="text-lg font-semibold mb-2">Pricing Information</h3>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
				<FormField
					control={form.control}
					name="currency"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-xs text-muted-foreground">
								Currency
							</FormLabel>
							{mode === formType.VIEW ? (
								<div className="mt-1">{field.value}</div>
							) : (
								<Select value={field.value} onValueChange={field.onChange}>
									<FormControl>
										<SelectTrigger className="h-8">
											<SelectValue placeholder="Select currency..." />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{(currencies || []).map((currency) => (
											<SelectItem key={currency.id} value={currency.id}>
												{currency.code} - {currency.name}
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
					name="price"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-xs text-muted-foreground">
								Unit Price
							</FormLabel>
							{mode === formType.VIEW ? (
								<div className="mt-1">{field.value}</div>
							) : (
								<FormControl>
									<Input
										type="number"
										min="0"
										step="0.01"
										className="h-8"
										{...field}
										onChange={(e) =>
											field.onChange(parseFloat(e.target.value) || 0)
										}
									/>
								</FormControl>
							)}
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="netAmount"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-xs text-muted-foreground">
								Net Amount
							</FormLabel>
							<div className="mt-1 h-8 flex items-center">
								{field.value?.toFixed(2) || '0.00'}
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="totalAmount"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-xs text-muted-foreground">
								Total Amount
							</FormLabel>
							<div className="mt-1 h-8 flex items-center font-medium">
								{field.value?.toFixed(2) || '0.00'}
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<div className="flex items-center mb-2">
						<FormField
							control={form.control}
							name="adjustments.discount"
							render={({ field }) => (
								<FormItem className="flex items-center space-x-2">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
											disabled={mode === formType.VIEW}
										/>
									</FormControl>
									<FormLabel className="text-sm font-medium">
										Apply Discount
									</FormLabel>
								</FormItem>
							)}
						/>
					</div>

					{form.watch('adjustments.discount') && (
						<div className="grid grid-cols-2 gap-2">
							<FormField
								control={form.control}
								name="discountRate"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xs text-muted-foreground">
											Discount Rate (%)
										</FormLabel>
										{mode === formType.VIEW ? (
											<div className="mt-1">{field.value}%</div>
										) : (
											<FormControl>
												<Input
													type="number"
													min="0"
													max="100"
													step="0.01"
													className="h-8"
													{...field}
													onChange={(e) =>
														field.onChange(parseFloat(e.target.value) || 0)
													}
												/>
											</FormControl>
										)}
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="discountAmount"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xs text-muted-foreground">
											Discount Amount
										</FormLabel>
										<div className="mt-1 h-8 flex items-center">
											{field.value?.toFixed(2) || '0.00'}
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					)}
				</div>

				<div>
					<div className="flex items-center mb-2">
						<FormField
							control={form.control}
							name="adjustments.tax"
							render={({ field }) => (
								<FormItem className="flex items-center space-x-2">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
											disabled={mode === formType.VIEW}
										/>
									</FormControl>
									<FormLabel className="text-sm font-medium">
										Apply Tax
									</FormLabel>
								</FormItem>
							)}
						/>
					</div>

					{form.watch('adjustments.tax') && (
						<>
							<div className="mb-2">
								<FormField
									control={form.control}
									name="taxIncluded"
									render={({ field }) => (
										<FormItem className="flex items-center space-x-2">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={field.onChange}
													disabled={mode === formType.VIEW}
												/>
											</FormControl>
											<FormLabel className="text-sm font-medium">
												Tax included in price
											</FormLabel>
										</FormItem>
									)}
								/>
							</div>

							<div className="grid grid-cols-2 gap-2">
								<FormField
									control={form.control}
									name="taxRate"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-xs text-muted-foreground">
												Tax Rate (%)
											</FormLabel>
											{mode === formType.VIEW ? (
												<div className="mt-1">{field.value}%</div>
											) : (
												<FormControl>
													<Input
														type="number"
														min="0"
														max="100"
														step="0.01"
														className="h-8"
														{...field}
														onChange={(e) =>
															field.onChange(parseFloat(e.target.value) || 0)
														}
													/>
												</FormControl>
											)}
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="taxAmount"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-xs text-muted-foreground">
												Tax Amount
											</FormLabel>
											<div className="mt-1 h-8 flex items-center">
												{field.value?.toFixed(2) || '0.00'}
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default PricingInformation;
