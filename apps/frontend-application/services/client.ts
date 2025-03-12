export const fetchData = async (
	url: string,
	token: string,
	tenantId: string
) => {

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
		throw new Error(
			`Failed to fetch from ${url}: ${response.status} ${response.statusText}`
		);
	}
	return response.json();
};
