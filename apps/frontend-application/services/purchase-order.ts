export const fetchPurchaseOrders = async (signal?: AbortSignal) => {
    try {
        const response = await fetch('/api/procurement/purchase-orders', {
            headers: {
                Accept: 'application/json',
            },
            signal,
        });

        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
            throw new Error('Invalid response format from server');
        }

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch purchase orders');
        }

        if (!Array.isArray(result.data)) {
            throw new Error('Invalid data format received');
        }

        return result.data;
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return null;
        console.error('Error fetching Purchase Orders:', error);
        throw new Error(
            error instanceof Error ? error.message : 'Error fetching Purchase Orders'
        );
    }
};