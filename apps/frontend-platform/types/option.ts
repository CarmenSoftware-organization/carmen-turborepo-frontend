import { RoleType, StatusType } from "./main"

export const STATUS_OPTION = {
    [StatusType.ACTIVE]: 'Active',
    [StatusType.INACTIVE]: 'Inactive',
}

export const ROLE_OPTION = {
    [RoleType.MANAGER]: 'Manager',
    [RoleType.INVENTORY]: 'Inventory',
    [RoleType.REPORTS]: 'Reports',
    [RoleType.PROCUREMENT]: 'Procurement',
    [RoleType.SPA_MANAGER]: 'Spa Manager',
    [RoleType.RESTAURANT_MANAGER]: 'Restaurant Manager',
}

export const HOTEL_GROUP_OPTION = [
    { key: 'c9f5b2a0-1d6e-4f74-a1b6-2e8d3c9b6d01', value: 'Luxury' },
    { key: 'b4e6a8c3-2f45-4f88-85d9-3a6c2f8a4e72', value: 'Resort' },
    { key: 'e1d2b7a9-3c9f-4872-b6d8-5f7c1a2e4d50', value: 'Business Hotels' },
    { key: 'f8a6c2d9-5b3e-4a7f-9d1c-2e4b8c7f6a31', value: 'Boutique Hotels' },
    { key: 'a7d5b3c2-6e4f-4a9d-8c1b-3f7e2d8a5c90', value: 'Eco-Friendly Hotels' },
];

export const MODULE_OPTION = [
    { key: "finance", value: "Finance" },
    { key: "inventory", value: "Inventory" },
    { key: "reports", value: "Reports" },
    { key: "procurement", value: "Procurement" },
    { key: "spa", value: "Spa" },
    { key: "restaurant", value: "Restaurant" },
]

export const DEPARTMENT_OPTION = [
    { key: "kitchen", value: "Kitchen" },
    { key: "operations", value: "Operations" },
    { key: "sales", value: "Sales" },
    { key: "marketing", value: "Marketing" },
    { key: "hr", value: "HR" },
    { key: "it", value: "IT" },
    { key: "security", value: "Security" },
    { key: "maintenance", value: "Maintenance" },
    { key: "housekeeping", value: "Housekeeping" },
    { key: "frontdesk", value: "Front Desk" },
    { key: "reservations", value: "Reservations" },
    { key: "events", value: "Events" },
    { key: "concierge", value: "Concierge" },
]

export const HOTEL_OPTION = [
    { key: "the_ritz_carlton", value: "The Ritz-Carlton" },
    { key: "four_seasons_hotel", value: "Four Seasons Hotel" },
    { key: "mandarin_oriental", value: "Mandarin Oriental" },
    { key: "the_peninsula", value: "The Peninsula" },
    { key: "waldorf_astoria", value: "Waldorf Astoria" },
    { key: "shangri_la_hotel", value: "Shangri-La Hotel" },
    { key: "park_hyatt", value: "Park Hyatt" },
    { key: "st_regis", value: "St. Regis" },
    { key: "aman_resorts", value: "Aman Resorts" },
    { key: "bulgari_hotel", value: "Bulgari Hotel" }
];

