import { CardsContainerSkeleton } from '@/components/ui-custom/Loading/CardsContainerSkeleton';
import { TableBodySkeleton } from '@/components/ui-custom/Loading/TableBodySkeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Link } from '@/lib/i18n';
import { PurchaseOrderStatus, PurchaseOrderType } from '@/lib/types';
import { statusPoColor } from '@/lib/util/status';
import { FieldConfig } from '@/lib/util/uiConfig';
import { action_text } from '@/paraglide/messages';
import { Eye, Pen, Trash } from 'lucide-react';
import React from 'react';

interface Props {
	poDatas: PurchaseOrderType[];
	fields: FieldConfig<PurchaseOrderType>[];
	isLoading: boolean;
}

const renderField = (
	field: FieldConfig<PurchaseOrderType>,
	item: PurchaseOrderType
): React.ReactNode => {
	const value = item[field.key];
	if (field.render) {
		return field.render(value, item); // Custom render
	}
	switch (field.type) {
		case 'badge':
			return (
				<Badge
					className={`rounded-xl ${typeof value === 'string' ? statusPoColor(value as PurchaseOrderStatus) : ''}`}
				>
					{String(value)}
				</Badge>
			);
		default:
			if (value instanceof Date) {
				return <span className="text-xs">{value.toLocaleDateString()}</span>;
			}
			return <span className="text-xs">{String(value)}</span>;
	}
};

const actionButton = (id: string) => (
	<>
		<Button asChild variant="ghost" size={'sm'}>
			<Link href={`/procurement/purchase-orders/${id}`}>
				<Eye />
			</Link>
		</Button>
		<Button variant={'ghost'} size={'sm'}>
			<Pen />
		</Button>
		<Button variant={'ghost'} size={'sm'}>
			<Trash />
		</Button>
	</>
);

const PoData: React.FC<Props> = ({ poDatas, fields, isLoading }) => {

	return (
		<>
			{/* Mobile View */}
			<div className="block md:hidden">
				{isLoading ? (
					<CardsContainerSkeleton fields={fields.length} cards={5} withAction />
				) : (
					<div className="grid grid-cols-1 gap-4">
						{poDatas.map((data) => (
							<Card key={data.poId} className="hover:shadow-md transition-all">
								<CardContent className="p-4 space-y-2">
									{fields.map((field) => {
										return (
											<div key={field.key} className="grid grid-cols-10 gap-4">
												<span className="text-sm text-muted-foreground col-span-3">
													{field.label}
												</span>
												<span className="col-span-7">
													{renderField(field, data)}
												</span>
											</div>
										);
									})}
								</CardContent>
								<CardFooter className="flex justify-end gap-2 pt-0 pb-2 px-2">
									{actionButton(data.poId)}
								</CardFooter>
							</Card>
						))}
					</div>
				)}
			</div>

			<div className="hidden md:block">
				<Table>
					<TableHeader>
						<TableRow className="text-xs">
							<TableHead className="w-[20px]">#</TableHead>
							{fields.map((field) => (
								<TableHead key={field.key}>{field.label}</TableHead>
							))}
							<TableHead className="text-right">{action_text()}</TableHead>
						</TableRow>
					</TableHeader>
					{isLoading ? (
						<TableBodySkeleton columns={fields.length} withAction />
					) : (
						<TableBody>
							{poDatas.map((data, index) => (
								<TableRow key={data.poId}>
									<TableCell className="font-medium text-xs">
										{index + 1}
									</TableCell>
									{fields.map((field) => {
										return (
											<TableCell key={field.key}>
												{renderField(field, data)}
											</TableCell>
										);
									})}
									<TableCell className="text-right w-52">
										{actionButton(data.poId)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					)}
				</Table>
			</div>
		</>
	);
};

export default PoData;
