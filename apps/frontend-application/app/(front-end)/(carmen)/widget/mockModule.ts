export enum ActionType {
    VIEW_ALL = "VA",
    VIEW = "V",
    CREATE = "C",
    UPDATE = "U",
    DELETE_ALL = "DA",
    DELETE = "D"
}

export enum UserRole {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    STAFF = "STAFF",
    VIEWER = "VIEWER"
}

export interface Module {
    id: string;
    name: string;
    license_no: string;
    status: boolean;
}

export const ProcurementModules: Module[] = [
    {
        id: "id_01",
        name: "Purchase Request Management",
        license_no: "PR-001",
        status: true
    },
    {
        id: "id_02",
        name: "Purchase Request Approval",
        license_no: "PR-002",
        status: true
    },
    {
        id: "id_03",
        name: "Purchase Order Management",
        license_no: "PO-001",
        status: false
    },
    {
        id: "id_04",
        name: "Supplier Purchase Orders",
        license_no: "PO-002",
        status: true
    },
    {
        id: "id_05",
        name: "PR-PO Reconciliation",
        license_no: "PR-PO-001",
        status: true
    },
    {
        id: "id_06",
        name: "Procurement Reporting",
        license_no: "PR-PO-002",
        status: false
    }
];