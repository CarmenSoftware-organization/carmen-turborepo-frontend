import { INVENTORY_TYPE } from "./enum";

export const statusOptions = [
    { label: 'All', value: '' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
];

export const boolFilterOptions = [
    { label: 'All', value: '' },
    { label: 'Active', value: 'is_active|bool:true' },
    { label: 'Inactive', value: 'is_active|bool:false' },
];


export const statusSpotCheckOptions = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
    { label: 'In Progress', value: 'in-progress' },
];


export const inventoryTypeOptions = [
    { label: 'Inventory', value: INVENTORY_TYPE.INVENTORY },
    { label: 'Direct', value: INVENTORY_TYPE.DIRECT },
    { label: 'Consignment', value: INVENTORY_TYPE.CONSIGNMENT },
];
