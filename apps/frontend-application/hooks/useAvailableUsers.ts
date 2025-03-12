import { useEffect, useState } from 'react';
import { UserLocationModel } from '@/dtos/location.dto';
import { useAuth } from '@/app/context/AuthContext';

const useAvailableUsers = () => {
	const { accessToken } = useAuth();
	const [availableUsers, setAvailableUsers] = useState<UserLocationModel[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchAvailableUsers = async () => {
			if (!accessToken) return;

			try {
				const response = await fetch(
					'/api/configuration/locations/available-users',
					{
						headers: {
							Authorization: `Bearer ${accessToken || ''}`,
							'x-tenant-id': '6ba7b921-9dad-11d1-80b4-00c04fd430c8',
						},
					}
				);

				if (!response.ok) {
					throw new Error('Failed to fetch available users');
				}

				const data = await response.json();
				setAvailableUsers(data.data);
			} catch (error) {
				console.error('Error fetching available users:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAvailableUsers();
	}, [accessToken]);

	return { availableUsers, isLoading };
};

export default useAvailableUsers;
