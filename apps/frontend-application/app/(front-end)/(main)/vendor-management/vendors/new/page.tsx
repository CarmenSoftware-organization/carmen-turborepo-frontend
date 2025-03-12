import React from 'react';
import VendorDetails from '../../components/VendorDetails';
import { formType } from '@/constants/enums';
const NewVendorPage = () => {
	return (
		<VendorDetails vendor={null} mode={formType.ADD} data-id="vendor-details" />
	);
};

export default NewVendorPage;