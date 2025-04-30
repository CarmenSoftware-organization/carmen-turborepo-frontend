export const requestHeaders = (token: string, tenantId: string) => ({
    'Authorization': `Bearer ${token}`,
    'x-tenant-id': tenantId,
    'Content-Type': 'application/json',
});