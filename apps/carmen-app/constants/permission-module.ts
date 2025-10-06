export const permissions = {
    // dashboard
    dashboard: ["view_all", "view", "create", "update", "delete"],

    // procurement
    procurement: {
        dashboard: ["view_all", "view", "create", "update", "delete"],
        my_approval: ["view_all", "view", "create", "update", "delete"],
        purchase_request: ["view_all", "view", "create", "update", "delete"],
        purchase_order: ["view_all", "view", "create", "update", "delete"],
        goods_received_note: ["view_all", "view", "create", "update", "delete"],
        credit_note: ["view_all", "view", "create", "update", "delete"],
        vendor_comparison: ["view_all", "view", "create", "update", "delete"],
        purchase_request_template: ["view_all", "view", "create", "update", "delete"],
    },

    // product_management
    product_management: {
        product: ["view_all", "view", "create", "update", "delete"],
        category: ["view_all", "view", "create", "update", "delete"],
        report: ["view_all", "view", "create", "update", "delete"],
        unit: ["view_all", "view", "create", "update", "delete"],
    },

    // vendor_management
    vendor_management: {
        vendor: ["view_all", "view", "create", "update", "delete"],
        price_list: ["view_all", "view", "create", "update", "delete"],
        price_comparison: ["view_all", "view", "create", "update", "delete"],
    },

    // store_operations
    store_operations: {
        store_requisition: ["view_all", "view", "create", "update", "delete"],
        stock_replenishment: ["view_all", "view", "create", "update", "delete"],
        wastage_reporting: ["view_all", "view", "create", "update", "delete"],
    },

    // inventory_management
    inventory_management: {
        inventory_adjustment: ["view_all", "view", "create", "update", "delete"],
        spot_check: ["view_all", "view", "create", "update", "delete"],
        physical_count_management: ["view_all", "view", "create", "update", "delete"],
        period_end: ["view_all", "view", "create", "update", "delete"],
        stock_overview: {
            overview: ["view_all", "view", "create", "update", "delete"],
            inventory_balance: ["view_all", "view", "create", "update", "delete"],
            inventory_aging: ["view_all", "view", "create", "update", "delete"],
            stock_card: ["view_all", "view", "create", "update", "delete"],
            slow_moving: ["view_all", "view", "create", "update", "delete"],
        },
    },

    // operational_planning
    operational_planning: {
        recipe_management: {
            recipe: ["view_all", "view", "create", "update", "delete"],
            category: ["view_all", "view", "create", "update", "delete"],
            cuisine_type: ["view_all", "view", "create", "update", "delete"],
        },
        menu_engineering: ["view_all", "view", "create", "update", "delete"],
        demand_forecasting: ["view_all", "view", "create", "update", "delete"],
        inventory_planning: ["view_all", "view", "create", "update", "delete"],
    },

    // production
    production: {
        recipe_execution: ["view_all", "view", "create", "update", "delete"],
        batch_production: ["view_all", "view", "create", "update", "delete"],
        wastage_tracking: ["view_all", "view", "create", "update", "delete"],
        quality_control: ["view_all", "view", "create", "update", "delete"],
    },

    // reporting_and_analytics
    reporting_and_analytics: {
        operational_reports: ["view_all", "view", "create", "update", "delete"],
        financial_reports: ["view_all", "view", "create", "update", "delete"],
        inventory_reports: ["view_all", "view", "create", "update", "delete"],
        vendor_performance: ["view_all", "view", "create", "update", "delete"],
        cost_analysis: ["view_all", "view", "create", "update", "delete"],
        sales_analysis: ["view_all", "view", "create", "update", "delete"],
    },

    // finance
    finance: {
        account_code_mapping: ["view_all", "view", "create", "update", "delete"],
        exchange_rates: ["view_all", "view", "create", "update", "delete"],
        budget_planning_and_control: ["view_all", "view", "create", "update", "delete"],
        credit_terms: ["view_all", "view", "create", "update", "delete"],
        vat: ["view_all", "view", "create", "update", "delete"],
    },

    // configuration
    configuration: {
        currency: ["view_all", "view", "create", "update", "delete"],
        exchange_rates: ["view_all", "view", "create", "update", "delete"],
        delivery_point: ["view_all", "view", "create", "update", "delete"],
        store_location: ["view_all", "view", "create", "update", "delete"],
        department: ["view_all", "view", "create", "update", "delete"],
        tax_profile: ["view_all", "view", "create", "update", "delete"],
        extra_cost: ["view_all", "view", "create", "update", "delete"],
        business_type: ["view_all", "view", "create", "update", "delete"],
    },

    // system_administration
    system_administration: {
        user_management: ["view_all", "view", "create", "update", "delete"],
        workflow_management: ["view_all", "view", "create", "update", "delete"],
        general_settings: ["view_all", "view", "create", "update", "delete"],
        notification_preferences: ["view_all", "view", "create", "update", "delete"],
        license_management: ["view_all", "view", "create", "update", "delete"],
        security_settings: ["view_all", "view", "create", "update", "delete"],
        data_backup_and_recovery: ["view_all", "view", "create", "update", "delete"],
        cluster: ["view_all", "view", "create", "update", "delete"],
        business_unit: ["view_all", "view", "create", "update", "delete"],
        user: ["view_all", "view", "create", "update", "delete"],
    },

    // help_and_support
    help_and_support: {
        user_manuals: ["view_all", "view", "create", "update", "delete"],
        video_tutorials: ["view_all", "view", "create", "update", "delete"],
        faqs: ["view_all", "view", "create", "update", "delete"],
        support_ticket_system: ["view_all", "view", "create", "update", "delete"],
        system_updates_and_release_notes: ["view_all", "view", "create", "update", "delete"],
    },

    // system_integration
    system_integration: {
        pos: ["view_all", "view", "create", "update", "delete"],
    },

    // profile
    profile: ["view_all", "view", "create", "update", "delete"],
} as const;

// Helper type to get all permission values
export type Permission = typeof permissions[keyof typeof permissions];

