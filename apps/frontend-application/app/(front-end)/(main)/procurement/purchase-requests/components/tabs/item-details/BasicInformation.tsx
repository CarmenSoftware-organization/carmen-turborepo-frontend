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
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { formType } from '@/constants/enums';
import StatusBadge from '@/components/ui-custom/custom-status-badge';

interface BasicInformationProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	form: UseFormReturn<any>;
	mode: formType;
	locations: {
		name: string;
		id?: string;
		description?: string;
		is_active?: boolean;
	}[];
	products: {
		name: string;
		id?: string;
		description?: string;
		is_active?: boolean;
	}[];
	getLocationNameById: (id: string) => string;
	getProductNameById: (id: string) => string;
}

const BasicInformation: React.FC<BasicInformationProps> = ({
	form,
	mode,
	locations,
	products,
	getLocationNameById,
	getProductNameById,
}) => {
	return (
		<div>
			<div className="flex justify-between items-center mb-2">
				<h3 className="text-lg font-semibold">Basic Information</h3>
				<StatusBadge status={form.watch('status')} />
			</div>
			<div className="grid grid-cols-1 md:grid-cols-4 gap-2">
				<FormField
					control={form.control}
					name="location"
					render={({ field }) => (
						<FormItem>
							<FormLabel
								className={cn(
									'text-xs text-muted-foreground',
									"after:content-['*'] after:ml-0.5 after:text-red-500"
								)}
							>
								Location
							</FormLabel>
							{mode === formType.VIEW ? (
								<div className="mt-1">{getLocationNameById(field.value)}</div>
							) : (
								<Select value={field.value} onValueChange={field.onChange}>
									<FormControl>
										<SelectTrigger className="h-8">
											<SelectValue placeholder="Select location..." />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{locations.map((location) => (
											<SelectItem key={location.id} value={location.id ?? ''}>
												{location.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="sm:col-span-2">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel
									className={cn(
										'text-xs text-muted-foreground',
										"after:content-['*'] after:ml-0.5 after:text-red-500"
									)}
								>
									Product name
								</FormLabel>
								{mode === formType.VIEW ? (
									<div className="mt-1">{getProductNameById(field.value)}</div>
								) : (
									<Select value={field.value} onValueChange={field.onChange}>
										<FormControl>
											<SelectTrigger className="h-8">
												<SelectValue placeholder="Select product..." />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{products.map((product) => (
												<SelectItem key={product.id} value={product.id ?? ''}>
													{product.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="sm:col-span-1">
					<FormField
						control={form.control}
						name="jobCode"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-xs text-muted-foreground">
									Job code
								</FormLabel>
								{mode === formType.VIEW ? (
									<div className="mt-1">{field.value}</div>
								) : (
									<FormControl>
										<Input {...field} className="h-8" />
									</FormControl>
								)}
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-xs text-muted-foreground">
								Description
							</FormLabel>
							{mode === formType.VIEW ? (
								<div className="mt-1">{field.value}</div>
							) : (
								<FormControl>
									<Textarea {...field} className="h-8 w-full" />
								</FormControl>
							)}
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="comment"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-xs text-muted-foreground">
								Comment
							</FormLabel>
							{mode === formType.VIEW ? (
								<div className="mt-1">{field.value}</div>
							) : (
								<FormControl>
									<Textarea
										{...field}
										className="h-8 w-full"
										placeholder="Add any additional notes here"
									/>
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

export default BasicInformation;
