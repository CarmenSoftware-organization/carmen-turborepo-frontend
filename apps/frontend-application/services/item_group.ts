export const fetchItemGroup = async (
	token: string,
	tenantId: string
) => {
	try {
		const perpage = 99
		const url = `/api/product-management/category/product-item-group?perpage=${perpage}`;

		const options = {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId,
				'Content-Type': 'application/json',
			},
		};

		const response = await fetch(url, options);

		if (!response.ok) {
			if (response.status === 401) {
				throw new Error('Unauthorized access - Invalid or expired token');
			}
			throw new Error(
				`Failed to fetch data: ${response.status} ${response.statusText}`
			);
		}

		return await response.json();
	} catch (error) {
		console.error('Error fetching product item group:', error);
		throw error;
	}
};
