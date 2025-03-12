import React from 'react';
import { AlertCircle, Pencil, Plus, Scale, TrashIcon } from 'lucide-react';
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { OrderUnitModel } from '@/dtos/order-unit.dto';

interface Props {
	isEdit: boolean;
	productCode: string;
	productName: string;
	orderUnitList: OrderUnitModel[]; // เพิ่ม prop สำหรับรายการหน่วยสั่งซื้อ
	loading: boolean; // เพิ่ม prop สำหรับสถานะการโหลด
}

const OrderUnit: React.FC<Props> = ({
	isEdit,
	productCode,
	productName,
	orderUnitList,
	loading,
}) => {

	const handleDeleteUnit = (id: string) => {
		if (!isEdit) return;
		if (window.confirm('Are you sure you want to delete this unit?')) {
			console.log(`Deleting unit: ${id}`);
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="bg-background rounded-lg shadow-sm">
				<div className="p-4 border-b">
					<div className="flex justify-between items-center">
						<div className="flex items-center space-x-2">
							<Scale className="w-5 h-5" />
							<h2 className="text-xs font-medium">Order Units</h2>
						</div>
						<div className="flex items-center space-x-2">
							<span className="text-xs">Inventory Unit:</span>
							<span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded">
								KG
							</span>
						</div>
					</div>
				</div>
				<div className="p-4">
					<div className="grid grid-cols-2 gap-6">
						<div>
							<label className="text-xs">Product Code</label>
							<div className="mt-1 text-xs font-medium">{productCode}</div>
						</div>
						<div>
							<label className="text-xs">Product Name</label>
							<div className="mt-1 text-xs font-medium">{productName}</div>
						</div>
					</div>
				</div>
			</div>

			{/* Order Units Table */}
			<div className="rounded-lg shadow-sm p-6 bg-background">
				<div className="border-b flex justify-between items-center mb-4">
					<h3 className="text-xs font-medium">Order Units</h3>
					{isEdit && (
						<Button variant="ghost" size="sm" className="text-xs">
							<Plus /> New Order Unit
						</Button>
					)}
				</div>

				{/* Loading State */}
				{loading ? (
					<div className="flex justify-center items-center h-32">
						<span className="text-xs text-gray-500">Loading...</span>
					</div>
				) : orderUnitList.length === 0 ? (
					<div className="flex justify-center items-center h-32">
						<span className="text-xs text-gray-500">No order units available</span>
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-left">From Unit</TableHead>
								<TableHead className="text-left">To Unit</TableHead>
								<TableHead className="text-right">Conversion Factor</TableHead>
								<TableHead className="text-left">Description</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{orderUnitList.map((unit) => (
								<TableRow key={unit.id}>
									<TableCell>
										<div className="flex items-center space-x-1">
											<span className="text-xs font-medium">{unit.from_unit_qty}</span>
											<span className="text-xs text-gray-500">{unit.from_unit_name}</span>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center space-x-1">
											<span className="text-xs font-medium">{unit.to_unit_qty}</span>
											<span className="text-xs text-gray-500">{unit.to_unit_name}</span>
										</div>
									</TableCell>
									<TableCell className="text-right">
										<span className="text-xs tabular-nums block">
											{unit.from_unit_qty} {unit.from_unit_name} = {unit.to_unit_qty}{' '}
											{unit.to_unit_name}
										</span>
									</TableCell>
									<TableCell className="text-left">
										<span className="text-xs text-gray-500">{unit.description}</span>
									</TableCell>
									<TableCell>
										<div className="flex justify-end space-x-2">
											{isEdit && (
												<>
													<Button
														variant="ghost"
														size="sm"
														className="h-8 w-8 text-muted-foreground hover:text-blue-600"
													>
														<Pencil className="h-4 w-4" />
													</Button>
													<Button
														variant="ghost"
														size="sm"
														className="h-8 w-8 text-muted-foreground hover:text-destructive"
														onClick={() => handleDeleteUnit(unit.id)}
													>
														<TrashIcon className="h-4 w-4" />
													</Button>
												</>
											)}
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>

			{/* Quick Calculator */}
			<div className="bg-background rounded-lg shadow-sm">
				<div className="p-4 border-b">
					<h3 className="text-xs font-medium">Order Quantity Calculator</h3>
				</div>
				<div className="p-4">
					<div className="flex items-center space-x-4">
						<div>
							<label className="text-xs mb-1 block">Order Qty</label>
							<Input
								type="number"
								className="w-32 p-2 text-right text-xs"
								defaultValue="1"
							/>
						</div>
						<div>
							<label className="text-xs mb-1 block">Order Unit</label>
							<Select>
								<SelectTrigger className="w-32 p-2 text-xs">
									<SelectValue placeholder="Select Unit" />
								</SelectTrigger>
								<SelectContent>
									{orderUnitList.map((unit) => (
										<SelectItem key={unit.id} value={unit.id}>
											{unit.to_unit_name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="pt-6">
							<span className="text-gray-500">=</span>
						</div>
						<div>
							<label className="text-xs text-gray-500 mb-1 block">
								Inventory Quantity
							</label>
							<div className="text-sm font-medium tabular-nums">
								24 KG
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Notes */}
			<div className="bg-blue-50 rounded-lg p-4">
				<div className="flex items-start space-x-2">
					<AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
					<div>
						<h4 className="text-xs font-medium text-blue-900">
							Order Unit Information
						</h4>
						<ul className="mt-2 text-xs text-blue-700 space-y-1">
							<li>• Order units are used for purchasing and receiving</li>
							<li>
								• Default order unit will be used for automatic PO generation
							</li>
							<li>
								• Conversion factor shows how many inventory units are in one
								order unit
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderUnit;