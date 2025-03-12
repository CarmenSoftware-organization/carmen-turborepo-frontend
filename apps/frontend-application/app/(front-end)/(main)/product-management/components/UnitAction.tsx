import React from 'react';
import UnitDialog from './UnitDialog';
import { Button } from '@/components/ui/button';
import { FileDown, Printer } from 'lucide-react';
import { export_text, print_text } from '@/paraglide/messages';
import { UnitCreateModel } from '@/dtos/unit.dto';
import { formType } from '@/constants/enums';

interface UnitActionProps {
	handleSuccess: (values: UnitCreateModel) => void;
}

const UnitAction: React.FC<UnitActionProps> = ({ handleSuccess }) => {
	return (
		<div
			className="action-btn-container"
			data-id="unit-list-action-btn-container"
		>
			<UnitDialog
				mode={formType.ADD}
				onSuccess={handleSuccess}
				data-id="unit-list-unit-dialog"
			/>
			<Button
				variant="outline"
				className="group"
				size={'sm'}
				data-id="unit-list-export-button"
			>
				<FileDown className="h-4 w-4" data-id="unit-list-export-button-icon" />
				{export_text()}
			</Button>
			<Button variant="outline" size={'sm'} data-id="unit-list-print-button">
				<Printer className="h-4 w-4" data-id="unit-list-print-button-icon" />
				{print_text()}
			</Button>
		</div>
	);
};

export default UnitAction;
