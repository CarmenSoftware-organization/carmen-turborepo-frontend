import { VendorGetDto } from "@/dtos/vendor-management";

export const mockVendors: VendorGetDto[] = [
  {
    id: "vendor-001",
    name: "ABC Industrial Supplies",
    description: "Industrial supplies and equipment",
    business_type_id: "bt-001",
    business_type_name: "Industrial Supplier",
    info: [
      { label: "Email", value: "contact@abc-supplies.com", data_type: "string" },
      { label: "Phone", value: "+66 2 123 4567", data_type: "string" },
      { label: "Tax ID", value: "0105558123456", data_type: "string" },
    ],
    is_active: true,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z",
    vendor_address: [
      {
        id: "addr-001",
        address_type: "contact_address",
        address: {
          line_1: "123 Industrial Road",
          district: "Bangkok",
          province: "Bangkok",
          country: "Thailand",
        },
        is_active: true,
      },
    ],
    vendor_contact: [
      {
        id: "contact-001",
        contact_type: "Primary",
        description: "Main contact person",
        info: [
          { label: "Name", value: "John Smith", data_type: "string" },
          { label: "Email", value: "john@abc-supplies.com", data_type: "string" },
          { label: "Phone", value: "+66 81 234 5678", data_type: "string" },
        ],
        is_active: true,
      },
    ],
  },
  {
    id: "vendor-002",
    name: "Global Tech Solutions",
    description: "Technology solutions and services",
    business_type_id: "bt-002",
    business_type_name: "Technology Provider",
    info: [
      { label: "Email", value: "info@globaltech.com", data_type: "string" },
      { label: "Phone", value: "+66 2 234 5678", data_type: "string" },
      { label: "Tax ID", value: "0105559234567", data_type: "string" },
    ],
    is_active: true,
    created_at: "2024-01-20T09:00:00Z",
    updated_at: "2024-01-20T09:00:00Z",
    vendor_address: [
      {
        id: "addr-002",
        address_type: "contact_address",
        address: {
          line_1: "456 Technology Plaza",
          district: "Bangkok",
          province: "Bangkok",
          country: "Thailand",
        },
        is_active: true,
      },
    ],
    vendor_contact: [
      {
        id: "contact-002",
        contact_type: "Primary",
        description: "Main contact person",
        info: [
          { label: "Name", value: "Jane Doe", data_type: "string" },
          { label: "Email", value: "jane@globaltech.com", data_type: "string" },
          { label: "Phone", value: "+66 81 345 6789", data_type: "string" },
        ],
        is_active: true,
      },
    ],
  },
  {
    id: "vendor-003",
    name: "Prime Manufacturing Co.",
    description: "Manufacturing and production",
    business_type_id: "bt-003",
    business_type_name: "Manufacturer",
    info: [
      { label: "Email", value: "sales@primemfg.com", data_type: "string" },
      { label: "Phone", value: "+66 2 345 6789", data_type: "string" },
      { label: "Tax ID", value: "0105560345678", data_type: "string" },
    ],
    is_active: true,
    created_at: "2024-02-01T10:00:00Z",
    updated_at: "2024-02-01T10:00:00Z",
    vendor_address: [
      {
        id: "addr-003",
        address_type: "contact_address",
        address: {
          line_1: "789 Manufacturing Ave",
          district: "Samut Prakan",
          province: "Samut Prakan",
          country: "Thailand",
        },
        is_active: true,
      },
    ],
    vendor_contact: [
      {
        id: "contact-003",
        contact_type: "Primary",
        description: "Main contact person",
        info: [
          { label: "Name", value: "Bob Johnson", data_type: "string" },
          { label: "Email", value: "bob@primemfg.com", data_type: "string" },
          { label: "Phone", value: "+66 81 456 7890", data_type: "string" },
        ],
        is_active: true,
      },
    ],
  },
  {
    id: "vendor-004",
    name: "Eastern Logistics Ltd.",
    description: "Logistics and transportation",
    business_type_id: "bt-004",
    business_type_name: "Logistics",
    info: [
      { label: "Email", value: "contact@easternlogistics.com", data_type: "string" },
      { label: "Phone", value: "+66 2 456 7890", data_type: "string" },
      { label: "Tax ID", value: "0105561456789", data_type: "string" },
    ],
    is_active: true,
    created_at: "2024-02-10T11:00:00Z",
    updated_at: "2024-02-10T11:00:00Z",
    vendor_address: [
      {
        id: "addr-004",
        address_type: "contact_address",
        address: {
          line_1: "321 Logistics Center",
          district: "Chonburi",
          province: "Chonburi",
          country: "Thailand",
        },
        is_active: true,
      },
    ],
    vendor_contact: [
      {
        id: "contact-004",
        contact_type: "Primary",
        description: "Main contact person",
        info: [
          { label: "Name", value: "Alice Wong", data_type: "string" },
          { label: "Email", value: "alice@easternlogistics.com", data_type: "string" },
          { label: "Phone", value: "+66 81 567 8901", data_type: "string" },
        ],
        is_active: true,
      },
    ],
  },
  {
    id: "vendor-005",
    name: "Quality Parts International",
    description: "Parts and components supplier",
    business_type_id: "bt-005",
    business_type_name: "Parts Supplier",
    info: [
      { label: "Email", value: "info@qualityparts.com", data_type: "string" },
      { label: "Phone", value: "+66 2 567 8901", data_type: "string" },
      { label: "Tax ID", value: "0105562567890", data_type: "string" },
    ],
    is_active: true,
    created_at: "2024-02-15T12:00:00Z",
    updated_at: "2024-02-15T12:00:00Z",
    vendor_address: [
      {
        id: "addr-005",
        address_type: "contact_address",
        address: {
          line_1: "654 Parts Boulevard",
          district: "Bangkok",
          province: "Bangkok",
          country: "Thailand",
        },
        is_active: true,
      },
    ],
    vendor_contact: [
      {
        id: "contact-005",
        contact_type: "Primary",
        description: "Main contact person",
        info: [
          { label: "Name", value: "Michael Chen", data_type: "string" },
          { label: "Email", value: "michael@qualityparts.com", data_type: "string" },
          { label: "Phone", value: "+66 81 678 9012", data_type: "string" },
        ],
        is_active: true,
      },
    ],
  },
  {
    id: "vendor-006",
    name: "Superior Equipment Corp.",
    description: "Equipment and machinery",
    business_type_id: "bt-006",
    business_type_name: "Equipment Supplier",
    info: [
      { label: "Email", value: "sales@superiorequip.com", data_type: "string" },
      { label: "Phone", value: "+66 2 678 9012", data_type: "string" },
      { label: "Tax ID", value: "0105563678901", data_type: "string" },
    ],
    is_active: true,
    created_at: "2024-03-01T13:00:00Z",
    updated_at: "2024-03-01T13:00:00Z",
    vendor_address: [
      {
        id: "addr-006",
        address_type: "contact_address",
        address: {
          line_1: "987 Equipment Road",
          district: "Rayong",
          province: "Rayong",
          country: "Thailand",
        },
        is_active: true,
      },
    ],
    vendor_contact: [
      {
        id: "contact-006",
        contact_type: "Primary",
        description: "Main contact person",
        info: [
          { label: "Name", value: "Sarah Lee", data_type: "string" },
          { label: "Email", value: "sarah@superiorequip.com", data_type: "string" },
          { label: "Phone", value: "+66 81 789 0123", data_type: "string" },
        ],
        is_active: true,
      },
    ],
  },
];

export const mockVendorsResponse = {
  data: mockVendors,
  total: mockVendors.length,
  page: 1,
  pageSize: 10,
};
