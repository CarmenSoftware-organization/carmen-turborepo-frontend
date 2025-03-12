'use client';

import React, { useEffect, useState } from 'react';
import LocationForm from '../components/LocationForm';
import { LocationsModel } from '@/dtos/location.dto';
import { useAuth } from '@/app/context/AuthContext';
import ErrorCard from '@/components/ui-custom/error/ErrorCard';
import ProductLoading from '@/components/ui-custom/Loading/ProductLoading';
import { formType } from '@/constants/enums';
import { fetchLocationByID } from '@/services/location';

type Props = {
	params: {
		id: string;
	};
};

const EditLocationPage = ({ params: { id } }: Props) => {
	const { accessToken, tenantId } = useAuth();
	const [location, setLocation] = useState<LocationsModel | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchLocation = async () => {
			try {
				const data = await fetchLocationByID(id, accessToken || '', tenantId);
				if (!data) {
					throw new Error('Failed to fetch location');
				}
				setLocation(data);
			} catch (error) {
				setError(error instanceof Error ? error.message : 'An error occurred');
			} finally {
				setIsLoading(false);
			}
		};

		fetchLocation();
	}, [id, accessToken]);

	if (isLoading) return <ProductLoading />;
	if (error) return <ErrorCard message={error} />;
	if (!location) return <ErrorCard message="Location not found" />;

	return (
		<LocationForm
			defaultValues={location}
			data-id="location-form"
			type={formType.EDIT}
		/>
	);
};

export default EditLocationPage;
