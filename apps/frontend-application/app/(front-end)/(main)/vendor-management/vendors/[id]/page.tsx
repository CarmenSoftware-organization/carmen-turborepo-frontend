'use client';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import VendorDetails from '../../components/VendorDetails';
import { useAuth } from '@/app/context/AuthContext';
import { VendorCreateModel } from '@/dtos/vendor.dto';
import { fetchVendor } from '@/services/vendor';
import { formType } from '@/constants/enums';

const VendorIDPage = () => {
	const { id } = useParams() as { id: string };
	const [error, setError] = useState<string | null>(null);
	const [vendor, setVendor] = useState<VendorCreateModel | null>(null);
	const { accessToken, tenantId } = useAuth();
	const token = accessToken || '';

	useEffect(() => {
		const getVendor = async () => {
			const vendorData = await fetchVendor(id, token, tenantId);
			if (vendorData.error) {
				setError(vendorData.error);
			} else {
				setVendor(vendorData);
			}
		};
		getVendor();
	}, [id, token, tenantId]);

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<VendorDetails
			vendor={vendor}
			mode={formType.EDIT}
			data-id="vendor-details"
		/>
	);
};

export default VendorIDPage