export const validateRequest = (authHeader: string | null, tenantId: string | null): { error: string | null, status: number } => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { error: 'Unauthorized: Missing or invalid token', status: 401 };
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return { error: 'Unauthorized: Invalid token format', status: 401 };
    }
    if (!tenantId) {
        return { error: 'Bad Request: Missing x-tenant-id', status: 400 };
    }
    return { error: null, status: 200 };
}
