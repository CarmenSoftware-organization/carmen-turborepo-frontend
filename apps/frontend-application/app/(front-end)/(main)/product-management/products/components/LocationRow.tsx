import { LocationCreateModel, LocationData } from '@/dtos/location.dto';
import React from 'react'
import {
    TableCell,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2, Trash } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

const LocationRow: React.FC<{
	location: LocationData;
	isEdit: boolean;
	onDelete: (id: string) => void;
	onEdit: (newLocation: LocationData) => void;
	locationsList: LocationCreateModel[];
	loading: boolean;
	error: string | null;
	handleSelectOpen: (open: boolean) => Promise<void>;
	isNewlyAdded: boolean;
}> = ({
	location,
	isEdit,
	onDelete,
	onEdit,
	locationsList,
	loading,
	error,
	handleSelectOpen,
	isNewlyAdded,
}) => {
	const [isOpen, setIsOpen] = React.useState(false);
	const [isSelecting, setIsSelecting] = React.useState(isNewlyAdded);

	const handleLocationChange = (value: string) => {
		const selectedLoc = locationsList.find((loc) => loc.id === value);
		if (selectedLoc) {
			const newLocation = {
				location_id: selectedLoc.id || 'default',
				location_name: selectedLoc.name || 'Unknown',
				location_type: selectedLoc.location_type || 'default',
			};

			setIsOpen(false);
			setIsSelecting(false);
			onEdit(newLocation);
		}
	};

	const handleOpenChange = async (open: boolean) => {
		if (open) {
			await handleSelectOpen(open);
		}
		setIsOpen(open);
	};

	return (
		<TableRow className="text-sm">
			<TableCell className="px-2">
				{isEdit && isSelecting ? (
					<Select
						open={isOpen}
						defaultValue={location.location_id}
						onValueChange={handleLocationChange}
						onOpenChange={handleOpenChange}
					>
						<SelectTrigger className="w-full h-9">
							<SelectValue placeholder="Select location">
								{locationsList.find((loc) => loc.id === location.location_id)
									?.name || location.location_name}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{loading ? (
									<SelectItem value="loading" disabled>
										<div className="flex items-center space-x-2">
											<Loader2 className="h-4 w-4 animate-spin" />
											<span>Loading locations...</span>
										</div>
									</SelectItem>
								) : error ? (
									<SelectItem value="error" disabled>
										{error}
									</SelectItem>
								) : (
									locationsList.map((location) => (
										<SelectItem
											key={location.id}
											value={location.id || 'default'}
											className="py-2"
										>
											<div className="flex flex-col">
												<span className="font-medium">
													{location.name || 'Unnamed Location'}
												</span>
												<span className="text-xs text-muted-foreground">
													{location.location_type?.toUpperCase() || 'N/A'}
												</span>
											</div>
										</SelectItem>
									))
								)}
							</SelectGroup>
						</SelectContent>
					</Select>
				) : (
					<div className="flex items-center space-x-2">
						<span className="py-2 text-sm font-medium">
							{location.location_name}
						</span>
						{isNewlyAdded && (
							<span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
								New
							</span>
						)}
					</div>
				)}
			</TableCell>
			<TableCell className="px-0">
				<span className="inline-flex px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs">
					{location.location_type.toUpperCase()}
				</span>
			</TableCell>
			{isEdit && (
				<TableCell>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="hover:bg-destructive/10 hover:text-destructive"
								aria-label={`Delete ${location.location_name}`}
							>
								<Trash />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
								<AlertDialogDescription>
									Are you sure you want to remove {location.location_name} from
									this product? This action cannot be undone.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => onDelete(location.location_id)}
									className="bg-destructive hover:bg-destructive/90"
								>
									Delete
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</TableCell>
			)}
		</TableRow>
	);
};

export default LocationRow