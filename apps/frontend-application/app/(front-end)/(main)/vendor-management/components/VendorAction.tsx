import { Button } from '@/components/ui/button';
import { Link } from '@/lib/i18n';
import {
	create_vendor_text,
	export_text,
	print_text,
} from '@/paraglide/messages';
import { FileDown, Plus, Printer } from 'lucide-react';
import React from 'react';

const VendorAction = () => {
	return (
		<div className="action-btn-container">
			<Button asChild variant={'outline'} size={'sm'}>
				<Link href="/vendor-management/vendors/new">
					<Plus className="h-4 w-4" />
					{create_vendor_text()}
				</Link>
			</Button>
			<Button variant="outline" className="group" size={'sm'}>
				<FileDown className="h-4 w-4" />
				{export_text()}
			</Button>
			<Button variant="outline" size={'sm'}>
				<Printer className="h-4 w-4" />
				{print_text()}
			</Button>
		</div>
	);
};

export default VendorAction;
