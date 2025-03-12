export const fetchGoodsReceivedNotes = async (signal?: AbortSignal) => {
    try {
        const response = await fetch('/api/procurement/goods-received-note', {
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
            throw new Error(result.error || 'Failed to fetch goods received notes');
        }

        if (!Array.isArray(result.data)) {
            throw new Error('Invalid data format received');
        }

        return result.data;
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return null; // Ignore if aborted
        console.error('Error fetching Goods Receive Notes:', error);
        throw new Error(
            error instanceof Error ? error.message : 'Error fetching Goods Receive Notes'
        );
    }
};
