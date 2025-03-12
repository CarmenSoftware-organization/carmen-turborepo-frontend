// import { PurchaseOrderType } from '@/lib/types';
import { formType } from '@/constants/enums';
import React from 'react';

interface PoFormProps {
	mode: formType;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	po?: any;
}

const PoForm: React.FC<PoFormProps> = ({ mode, po }) => {
	return (
		<div>
			<p>this is mode : {mode}</p>
			<p>this is po : {po?.poId ? po.poId : 'new data po'}</p>
		</div>
	);
};

export default PoForm;
