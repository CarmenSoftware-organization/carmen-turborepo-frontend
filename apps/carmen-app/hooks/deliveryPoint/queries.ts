// Query keys for DeliveryPoint data
export const DELIVERY_POINT_KEYS = {
    all: ["deliveryPoints"] as const,
    lists: () => [...DELIVERY_POINT_KEYS.all, "list"] as const,
    list: (filters: Record<string, string>) => [...DELIVERY_POINT_KEYS.lists(), filters] as const,
    details: () => [...DELIVERY_POINT_KEYS.all, "detail"] as const,
    detail: (id: string) => [...DELIVERY_POINT_KEYS.details(), id] as const,
}; 