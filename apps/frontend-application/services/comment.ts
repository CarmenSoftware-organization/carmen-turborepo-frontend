export const postComment = async (token: string, tenantId: string, url: string, payload: { type: string; message: string }) => {
    const options = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    };

    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Error submit ${response.statusText}`);
    }

    return response;
};