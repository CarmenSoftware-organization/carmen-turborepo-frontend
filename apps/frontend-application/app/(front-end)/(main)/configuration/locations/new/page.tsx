'use client';

import React from 'react';
import LocationForm from '../components/LocationForm';
import ProductLoading from '@/components/ui-custom/Loading/ProductLoading';
import { formType } from '@/constants/enums';
import useAvailableUsers from '@/hooks/useAvailableUsers';

const NewLocationPage = () => {
	const { availableUsers, isLoading } = useAvailableUsers();
	if (isLoading) return <ProductLoading />;
	return (
		<LocationForm
			data-id="location-form"
			type={formType.ADD}
			defaultValues={{
				users: {
					active: [],
					inactive: availableUsers,
				},
			}}
		/>

	);
};

export default NewLocationPage;
