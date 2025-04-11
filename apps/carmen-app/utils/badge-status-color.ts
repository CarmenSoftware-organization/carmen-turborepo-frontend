import { INVENTORY_TYPE } from "@/constants/enum";
export const STORE_LOCATION_TYPE_COLOR = (type: INVENTORY_TYPE) => {
    switch (type) {
        case INVENTORY_TYPE.INVENTORY:
            return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
        case INVENTORY_TYPE.DIRECT:
            return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200';
        case INVENTORY_TYPE.CONSIGNMENT:
            return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
    }
}