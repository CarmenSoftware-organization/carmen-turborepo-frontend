export const fetchUnits = async (token: string, tenantId: string) => {
    try {
        const url = `/api/product-management/unit`;

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
            throw new Error('Failed to fetch units');
        }
        const result = await response.json();

        return result.data.data;
    } catch (error) {
        console.error('Error fetching units:', error);
        throw error;
    }
};