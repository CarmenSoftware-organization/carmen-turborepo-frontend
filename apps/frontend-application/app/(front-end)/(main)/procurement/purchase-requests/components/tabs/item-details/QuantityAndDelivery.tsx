import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { formType } from '@/constants/enums';
import { format } from 'date-fns';
import { CalendarIcon, Package, TruckIcon, XIcon } from 'lucide-react';
import InventoryBreakdown from './InventoryBreakdown';
import PendingPurchaseOrders from './PendingPurchaseOrders';

interface QuantityAndDeliveryProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	form: UseFormReturn<any>;
	mode: formType;
	units: {
		name: string;
		id?: string;
		description?: string;
		is_active?: boolean;
	}[];
	getUnitNameById: (id: string) => string;
}

const QuantityAndDelivery: React.FC<QuantityAndDeliveryProps> = ({
	form,
	mode,
	units,
	getUnitNameById,
}) => {
	const [isInventoryBreakdownOpen, setIsInventoryBreakdownOpen] =
		useState(false);
	const [isOnOrderOpen, setIsOnOrderOpen] = useState(false);

	return (
		<div>
			<div className="flex justify-between items-center mb-2">
				<h3 className="text-lg font-semibold">Quantity and Delivery</h3>
				<div className="flex gap-2">
					<Dialog
						open={isInventoryBreakdownOpen}
						onOpenChange={setIsInventoryBreakdownOpen}
					>
						<DialogTrigger asChild>
							<Button type="button" variant="outline" size="sm">
								<Package className="h-4 w-4 mr-1" />
								On Hand
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[60vw] w-[80vw] overflow-y-auto [&>button]:hidden">
							<DialogHeader>
								<div className="flex justify-between w-full items-center">
									<DialogTitle>On Hand by Location</DialogTitle>
									<DialogClose asChild>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setIsInventoryBreakdownOpen(false)}
										>
											<XIcon className="h-4 w-4" />
										</Button>
									</DialogClose>
								</div>
							</DialogHeader>
							<InventoryBreakdown />
						</DialogContent>
					</Dialog>

					<Dialog open={isOnOrderOpen} onOpenChange={setIsOnOrderOpen}>
						<DialogTrigger asChild>
							<Button type="button" variant="outline" size="sm">
								<TruckIcon className="h-4 w-4 mr-1" />
								On Order
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[60vw] overflow-y-auto [&>button]:hidden">
							<DialogHeader>
								<div className="flex justify-between w-full items-center">
									<DialogTitle>Pending Purchase Order</DialogTitle>
									<DialogClose asChild>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setIsOnOrderOpen(false)}
										>
											<XIcon className="h-4 w-4" />
										</Button>
									</DialogClose>
								</div>
							</DialogHeader>
							<PendingPurchaseOrders />
						</DialogContent>
					</Dialog>
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
				<FormField
					control={form.control}
					name="unit"
					render={({ field }) => (
						<FormItem>
							<FormLabel
								className={cn(
									'text-xs text-muted-foreground',
									"after:content-['*'] after:ml-0.5 after:text-red-500"
								)}
							>
								Order Unit
							</FormLabel>
							{mode === formType.VIEW ? (
								<div className="mt-1">{getUnitNameById(field.value)}</div>
							) : (
								<Select value={field.value} onValueChange={field.onChange}>
									<FormControl>
										<SelectTrigger className="h-8">
											<SelectValue placeholder="Select unit..." />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{units.map((unit) => (
											<SelectItem key={unit.id} value={unit.id ?? ''}>
												{unit.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
							<div className="text-xs text-muted-foreground mt-1">
								Base: Kg | 1 Bag = 0.5 Kg
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="quantityRequested"
					render={({ field }) => (
						<FormItem>
							<FormLabel
								className={cn(
									'text-xs text-muted-foreground',
									"after:content-['*'] after:ml-0.5 after:text-red-500"
								)}
							>
								Quantity Requested
							</FormLabel>
							{mode === formType.VIEW ? (
								<div className="mt-1">{field.value}</div>
							) : (
								<FormControl>
									<Input
										type="number"
										min="0"
										step="1"
										className="h-8"
										{...field}
										onChange={(e) =>
											field.onChange(parseFloat(e.target.value) || 0)
										}
									/>
								</FormControl>
							)}
							<div className="text-xs text-muted-foreground mt-1">5 Kg</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="quantityApproved"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-xs text-muted-foreground">
								Quantity Approved
							</FormLabel>
							{mode === formType.VIEW ? (
								<div className="mt-1">{field.value}</div>
							) : (
								<FormControl>
									<Input
										type="number"
										min="0"
										step="1"
										className="h-8"
										{...field}
										onChange={(e) =>
											field.onChange(parseFloat(e.target.value) || 0)
										}
									/>
								</FormControl>
							)}
							<div className="text-xs text-muted-foreground mt-1">4.5 Kg</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="foc"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-xs text-muted-foreground">
								FOC Qty
							</FormLabel>
							{mode === formType.VIEW ? (
								<div className="mt-1">{field.value}</div>
							) : (
								<FormControl>
									<Input
										type="number"
										min="0"
										step="1"
										className="h-8"
										{...field}
										onChange={(e) =>
											field.onChange(parseFloat(e.target.value) || 0)
										}
									/>
								</FormControl>
							)}
							<div className="text-xs text-muted-foreground mt-1">Base: 0</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="deliveryDate"
					render={({ field }) => (
						<FormItem>
							<FormLabel
								className={cn(
									'text-xs text-muted-foreground',
									"after:content-['*'] after:ml-0.5 after:text-red-500"
								)}
							>
								Delivery Date
							</FormLabel>
							{mode === formType.VIEW ? (
								<div className="mt-1">
									{field.value ? format(field.value, 'PPP') : 'Not set'}
								</div>
							) : (
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant="outline"
												className={cn(
													'w-full justify-start text-left font-normal h-8 text-xs',
													!field.value && 'text-muted-foreground'
												)}
											>
												<CalendarIcon className="h-4 w-4 mr-2" />
												{field.value ? (
													format(field.value, 'PPP')
												) : (
													<span>Pick a date</span>
												)}
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0">
										<Calendar
											mode="single"
											selected={field.value}
											onSelect={field.onChange}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							)}
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="deliveryPoint"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-xs text-muted-foreground">
								Delivery Point
							</FormLabel>
							{mode === formType.VIEW ? (
								<div className="mt-1">{field.value}</div>
							) : (
								<FormControl>
									<Input className="h-8" {...field} />
								</FormControl>
							)}
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<div className="mt-2">
				<div className="bg-muted p-2 rounded-md">
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
						<div>
							<p className="font-medium">On Hand</p>
							<p className="text-muted-foreground">
								{form.watch('inventoryInfo.onHand')} Kg
							</p>
						</div>
						<div>
							<p className="font-medium">On Ordered</p>
							<p className="text-muted-foreground">
								{form.watch('inventoryInfo.onOrdered')} Kg
							</p>
						</div>
						<div>
							<p className="font-medium">Reorder Level</p>
							<p className="text-muted-foreground">
								{form.watch('inventoryInfo.reorderLevel')} Kg
							</p>
						</div>
						<div>
							<p className="font-medium">Restock Level</p>
							<p className="text-muted-foreground">
								{form.watch('inventoryInfo.restockLevel')} Kg
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default QuantityAndDelivery;
