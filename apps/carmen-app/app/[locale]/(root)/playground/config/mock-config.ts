// Mock Permission Types
export type Role = 'admin' | 'leader' | 'requestor';

export interface RolePermissions {
    configuration: {
        currency: string[];
        exchange_rate: string[];
        delivery_point: string[];
        location: string[];
        department: string[];
        tax_profile: string[];
        extra_cost: string[];
        business_type: string[];
    };
    product_management: {
        unit: string[];
        product: string[];
        category: string[];
        report: string[];
    };
    vendor_management: {
        vendor: string[];
        price_list: string[];
        price_comparison: string[];
    };
    procurement: {
        purchase_request: string[];
        purchase_request_approval: string[];
        purchase_request_template: string[];
        purchase_order: string[];
        goods_received_note: string[];
        credit_note: string[];
        vendor_comparison: string[];
        my_approval: string[];
    };
    inventory_management: {
        stock_overview: string[];
        inventory_adjustment: string[];
        physical_count_management: string[];
        spot_check: string[];
        period_end: string[];
    };
    finance: {
        account_code_mapping: string[];
        credit_term: string[];
    };
}

// Mock Permissions Data
export const mockRolePermissions: Record<Role, RolePermissions> = {
    admin: {
        configuration: {
            currency: ['view_all', 'create', 'update', 'delete'],
            exchange_rate: ['view_all', 'create', 'update', 'delete'],
            delivery_point: ['view_all', 'create', 'update', 'delete'],
            location: ['view_all', 'create', 'update', 'delete'],
            department: ['view_all', 'create', 'update', 'delete'],
            tax_profile: ['view_all', 'create', 'update', 'delete'],
            extra_cost: ['view_all', 'create', 'update', 'delete'],
            business_type: ['view_all', 'create', 'update', 'delete'],
        },
        product_management: {
            unit: ['view_all', 'create', 'update', 'delete'],
            product: ['view_all', 'create', 'update', 'delete'],
            category: ['view_all', 'create', 'update', 'delete'],
            report: ['view_all'],
        },
        vendor_management: {
            vendor: ['view_all', 'create', 'update', 'delete'],
            price_list: ['view_all', 'create', 'update', 'delete'],
            price_comparison: ['view_all'],
        },
        procurement: {
            purchase_request: ['view_all', 'create', 'update', 'delete', 'submit', 'approve', 'reject', 'send_back'],
            purchase_request_approval: ['view_all', 'approve', 'reject', 'send_back'],
            purchase_request_template: ['view_all', 'create', 'update', 'delete'],
            purchase_order: ['view_all', 'create', 'update', 'delete', 'submit', 'approve', 'reject'],
            goods_received_note: ['view_all', 'create', 'update', 'delete'],
            credit_note: ['view_all', 'create', 'update', 'delete'],
            vendor_comparison: ['view_all'],
            my_approval: ['view_all', 'approve', 'reject', 'send_back'],
        },
        inventory_management: {
            stock_overview: ['view_all'],
            inventory_adjustment: ['view_all', 'create', 'update', 'delete', 'submit', 'approve'],
            physical_count_management: ['view_all', 'create', 'update', 'delete', 'submit', 'approve'],
            spot_check: ['view_all', 'create', 'update', 'delete'],
            period_end: ['view_all', 'create', 'approve'],
        },
        finance: {
            account_code_mapping: ['view_all', 'create', 'update', 'delete'],
            credit_term: ['view_all', 'create', 'update', 'delete'],
        },
    },
    leader: {
        configuration: {
            currency: ['view_all', 'create', 'update'],
            exchange_rate: ['view_all', 'create', 'update'],
            delivery_point: ['view_all', 'create', 'update'],
            location: ['view_all', 'create', 'update'],
            department: ['view_dp', 'update'],
            tax_profile: ['view_all', 'create', 'update'],
            extra_cost: ['view_all', 'create', 'update'],
            business_type: ['view_all'],
        },
        product_management: {
            unit: ['view_all', 'create', 'update'],
            product: ['view_all', 'create', 'update'],
            category: ['view_all', 'create', 'update'],
            report: ['view_all'],
        },
        vendor_management: {
            vendor: ['view_all', 'create', 'update'],
            price_list: ['view_all', 'create', 'update'],
            price_comparison: ['view_all'],
        },
        procurement: {
            purchase_request: ['view_dp', 'create', 'update', 'submit', 'approve', 'reject', 'send_back'],
            purchase_request_approval: ['view_dp', 'approve', 'reject', 'send_back'],
            purchase_request_template: ['view_all', 'create', 'update'],
            purchase_order: ['view_dp', 'create', 'update', 'approve', 'reject'],
            goods_received_note: ['view_dp', 'create', 'update'],
            credit_note: ['view_dp', 'create', 'update'],
            vendor_comparison: ['view_all'],
            my_approval: ['view_all', 'approve', 'reject', 'send_back'],
        },
        inventory_management: {
            stock_overview: ['view_dp'],
            inventory_adjustment: ['view_dp', 'create', 'update', 'submit', 'approve'],
            physical_count_management: ['view_dp', 'create', 'update', 'submit', 'approve'],
            spot_check: ['view_dp', 'create', 'update'],
            period_end: ['view_dp', 'approve'],
        },
        finance: {
            account_code_mapping: ['view_all', 'create', 'update'],
            credit_term: ['view_all', 'create', 'update'],
        },
    },
    requestor: {
        configuration: {
            currency: ['view_all'],
            exchange_rate: ['view_all'],
            delivery_point: ['view_all'],
            location: ['view_all'],
            department: ['view_dp'],
            tax_profile: ['view_all'],
            extra_cost: ['view_all'],
            business_type: ['view_all'],
        },
        product_management: {
            unit: ['view_all'],
            product: ['view_all'],
            category: ['view_all'],
            report: ['view_all'],
        },
        vendor_management: {
            vendor: ['view_all'],
            price_list: ['view_all'],
            price_comparison: ['view_all'],
        },
        procurement: {
            purchase_request: ['view', 'create', 'update', 'submit'],
            purchase_request_approval: [],
            purchase_request_template: ['view_all'],
            purchase_order: ['view'],
            goods_received_note: ['view'],
            credit_note: ['view'],
            vendor_comparison: ['view_all'],
            my_approval: ['view', 'approve', 'reject'],
        },
        inventory_management: {
            stock_overview: ['view'],
            inventory_adjustment: ['view', 'create', 'submit'],
            physical_count_management: ['view', 'create', 'submit'],
            spot_check: ['view', 'create'],
            period_end: ['view'],
        },
        finance: {
            account_code_mapping: ['view_all'],
            credit_term: ['view_all'],
        },
    },
};
