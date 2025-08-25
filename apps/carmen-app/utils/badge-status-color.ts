import { INVENTORY_TYPE } from "@/constants/enum";

export const STORE_LOCATION_TYPE_COLOR = (type: INVENTORY_TYPE) => {
    if (!type) return 'bg-gray-500';

    switch (type) {
        case INVENTORY_TYPE.INVENTORY:
            return 'bg-blue-500 hover:bg-blue-600';
        case INVENTORY_TYPE.DIRECT:
            return 'bg-green-500 hover:bg-green-600';
        case INVENTORY_TYPE.CONSIGNMENT:
            return 'bg-amber-500 hover:bg-amber-600';
        default:
            return 'bg-gray-500';
    }
};

export const convertPrStatus = (status: string) => {
    if (status === "pending") {
        return "Pending";
    } else if (status === "approved") {
        return "Approved";
    } else if (status === "reject") {
        return "Reject";
    } else if (status === "review") {
        return "Review";
    } else if (status === "in_progress") {
        return "In Progress";
    } else if (status === "work_in_process") {
        return "Work in Process";
    } else if (status === "draft") {
        return "Draft";
    } else if (status === "inactive") {
        return "Inactive";
    }
};