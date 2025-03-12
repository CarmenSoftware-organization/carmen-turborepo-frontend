export const fetchPrList = async (signal?: AbortSignal) => {
    try {
        const response = await fetch('/api/procurement/purchase-requests', {
            headers: {
                Accept: 'application/json',
            },
            signal, // Pass the abort signal
        });

        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
            throw new Error('Invalid response format from server');
        }

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch purchase requests');
        }

        return result.data;
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return null; // Ignore if aborted
        console.error('Error fetching Purchase Requests:', error);
        throw new Error(
            error instanceof Error ? error.message : 'Error fetching Purchase Requests'
        );
    }
};