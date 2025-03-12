import { Button } from '@/components/ui/button';
import { Link } from '@/lib/i18n';
import { export_text, print_text, store_location } from '@/paraglide/messages';
import { FileDown, Plus, Printer } from 'lucide-react';
import React from 'react';

const LocationActions = () => {
	return (
		<div
			className="action-btn-container"
			data-id="store-location-action-btn-container"
		>
			<Button asChild size={'sm'} data-id="store-location-add-button">
				<Link href="/configuration/locations/new">
					<Plus data-id="store-location-add-icon" />
					{store_location()}
				</Link>
			</Button>
			<Button
				variant="outline"
				className="group"
				size={'sm'}
				data-id="store-location-export-button"
			>
				<FileDown data-id="store-location-export-icon" />
				{export_text()}
			</Button>
			<Button
				variant="outline"
				size={'sm'}
				data-id="store-location-print-button"
			>
				<Printer data-id="store-location-print-icon" />
				{print_text()}
			</Button>
		</div>
	);
};

export default LocationActions;
