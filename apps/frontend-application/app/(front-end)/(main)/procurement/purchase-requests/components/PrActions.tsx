import { Button } from '@/components/ui/button';
import { Link } from '@/lib/i18n';
import { export_text, print_text } from '@/paraglide/messages';
import { FileDown, Plus, Printer } from 'lucide-react';
import React from 'react';

const PrActions = () => {
	return (
		<div className="action-btn-container">
			<Button variant={'outline'} size={'sm'} asChild>
				<Link href={'/procurement/purchase-requests/new'}>
					<Plus />
					New Purchase Request
				</Link>
			</Button>
			<Button variant="outline" className="group" size={'sm'}>
				<FileDown />
				{export_text()}
			</Button>
			<Button variant="outline" size={'sm'}>
				<Printer />
				{print_text()}
			</Button>
		</div>
	);
};

export default PrActions;
