import {
  PriceListTemplateListDto,
  PriceListTemplateDetailsDto,
} from "@/dtos/price-list-template.dto";

// ============================================================================
// Mock Data - List View
// ============================================================================
export const mockPriceListTemplates: PriceListTemplateListDto[] = [
  {
    id: "plt-001",
    name: "Standard Beverage Price Template",
    status: "active",
    description: "Standard template for beverage category pricing submissions",
    vendor_instructions: "Please provide pricing for Q1 2025. Include all applicable taxes.",
    validity_period: 90,
    created_at: new Date("2024-12-01"),
    updated_at: new Date("2025-01-10"),
  },
  {
    id: "plt-002",
    name: "Meat & Seafood Premium Template",
    status: "active",
    description: "Premium template for high-value meat and seafood products",
    vendor_instructions: "Ensure all products meet Halal certification requirements.",
    validity_period: 60,
    created_at: new Date("2024-12-15"),
    updated_at: new Date("2025-01-15"),
  },
  {
    id: "plt-003",
    name: "Monthly Dry Goods Template",
    status: "inactive", // Changed from completed
    description: "Monthly recurring template for dry goods inventory",
    vendor_instructions: "Standard monthly pricing update.",
    validity_period: 30,
    created_at: new Date("2024-11-01"),
    updated_at: new Date("2024-12-28"),
  },
  {
    id: "plt-004",
    name: "Fresh Produce Quick Quote",
    status: "draft",
    description: "Fast-turnaround template for fresh produce weekly pricing",
    vendor_instructions: "Urgent: Prices needed by Friday EOD.",
    validity_period: 7,
    created_at: new Date("2025-01-15"),
    updated_at: new Date("2025-01-15"),
  },
  {
    id: "plt-005",
    name: "Annual Contract Template - Dairy",
    status: "inactive",
    description: "Comprehensive annual contract negotiation template for dairy suppliers",
    vendor_instructions: "Annual contract renewal. Please review terms attached.",
    validity_period: 365,
    created_at: new Date("2024-11-01"),
    updated_at: new Date("2024-11-30"),
  },
  {
    id: "plt-006",
    name: "Seasonal Produce Template",
    status: "active", // Changed from submit
    description: "Seasonal pricing template for fruits and vegetables",
    vendor_instructions: "Focus on seasonal availability.",
    validity_period: 120,
    created_at: new Date("2024-12-20"),
    updated_at: new Date("2025-01-18"),
  },
];

// ============================================================================
// Mock Data - Detail View (Array of Full Details)
// ============================================================================
export const mockPriceListTemplateDetails: PriceListTemplateDetailsDto[] = [
  // Detail #1 - Standard Beverage
  {
    id: "plt-001",
    name: "Standard Beverage Price Template",
    status: "active",
    description: "Standard template for beverage category pricing submissions",
    vendor_instructions: "Please provide pricing for Q1 2025. Include all applicable taxes.",
    validity_period: 90,
    created_at: new Date("2024-12-01"),
    updated_at: new Date("2025-01-10"),
    currency: {
      id: "curr-001",
      code: "THB",
    },
    products: [
      {
        id: "prod-001",
        product_id: "p-001",
        name: "Coca-Cola 330ml",
        code: "BEV-COLA-330",
        default_order: { unit_id: "u-001", unit_name: "Can" },
        moq: [{ unit_id: "u-002", unit_name: "Pack", qty: 6, note: "Min 1 pack" }],
      },
      {
        id: "prod-002",
        product_id: "p-002",
        name: "Pepsi 330ml",
        code: "BEV-PEPSI-330",
        default_order: { unit_id: "u-001", unit_name: "Can" },
      },
      {
        id: "prod-003",
        product_id: "p-003",
        name: "Sprite 330ml",
        code: "BEV-SPRITE-330",
        default_order: { unit_id: "u-001", unit_name: "Can" },
      },
      {
        id: "prod-004",
        product_id: "p-004",
        name: "Orange Juice 1L",
        code: "BEV-OJ-1000",
        default_order: { unit_id: "u-003", unit_name: "Bottle" },
      },
      {
        id: "prod-005",
        product_id: "p-005",
        name: "Mineral Water 500ml",
        code: "BEV-WATER-500",
        default_order: { unit_id: "u-003", unit_name: "Bottle" },
      },
    ],
    rfps: [
      {
        id: "rpl-001",
        name: "Q1 2025 Beverage Price Request",
        status: "active",
        priority: "high",
        description: "Quarterly price request for all beverage categories",
        created_at: new Date("2025-01-01"),
        res_rate: 66.67,
        count_vendors: 3,
      },
      {
        id: "rpl-006",
        name: "Q4 2024 Beverage Review",
        status: "completed",
        priority: "medium",
        description: "End of year beverage pricing review",
        created_at: new Date("2024-10-01"),
        res_rate: 100,
        count_vendors: 4,
      },
    ],
  },

  // Detail #2 - Meat & Seafood
  {
    id: "plt-002",
    name: "Meat & Seafood Premium Template",
    status: "active",
    description: "Premium template for high-value meat and seafood products",
    vendor_instructions: "Ensure all products meet Halal certification requirements.",
    validity_period: 60,
    created_at: new Date("2024-12-15"),
    updated_at: new Date("2025-01-15"),
    currency: {
      id: "curr-001",
      code: "THB",
    },
    products: [
      {
        id: "prod-011",
        product_id: "p-011",
        name: "Australian Beef Ribeye",
        code: "MEAT-BEEF-RIB",
        default_order: { unit_id: "u-004", unit_name: "kg" },
      },
      {
        id: "prod-012",
        product_id: "p-012",
        name: "Norwegian Salmon Fillet",
        code: "FISH-SALM-FIL",
        default_order: { unit_id: "u-004", unit_name: "kg" },
      },
      {
        id: "prod-013",
        product_id: "p-013",
        name: "Premium Pork Loin",
        code: "MEAT-PORK-LOIN",
        default_order: { unit_id: "u-004", unit_name: "kg" },
      },
      {
        id: "prod-014",
        product_id: "p-014",
        name: "Fresh Tiger Prawns",
        code: "FISH-PRAWN-TIG",
        default_order: { unit_id: "u-004", unit_name: "kg" },
      },
      {
        id: "prod-015",
        product_id: "p-015",
        name: "Sea Bass Whole",
        code: "FISH-BASS-WHL",
        default_order: { unit_id: "u-004", unit_name: "kg" },
      },
    ],
    rfps: [
      {
        id: "rpl-002",
        name: "Meat & Seafood Special Campaign",
        status: "submit",
        priority: "high",
        description: "Special promotional campaign for premium meat products",
        created_at: new Date("2025-01-05"),
        res_rate: 80,
        count_vendors: 5,
      },
    ],
  },

  // Detail #3 - Monthly Dry Goods
  {
    id: "plt-003",
    name: "Monthly Dry Goods Template",
    status: "inactive", // Changed from completed
    description: "Monthly recurring template for dry goods inventory",
    vendor_instructions: "Standard monthly pricing update.",
    validity_period: 30,
    created_at: new Date("2024-11-01"),
    updated_at: new Date("2024-12-28"),
    currency: {
      id: "curr-001",
      code: "THB",
    },
    products: [
      {
        id: "prod-021",
        product_id: "p-021",
        name: "Jasmine Rice 25kg",
        code: "DRY-RICE-JAS-25",
        default_order: { unit_id: "u-005", unit_name: "Bag" },
      },
      {
        id: "prod-022",
        product_id: "p-022",
        name: "All Purpose Flour 10kg",
        code: "DRY-FLOUR-AP-10",
        default_order: { unit_id: "u-005", unit_name: "Bag" },
      },
      {
        id: "prod-023",
        product_id: "p-023",
        name: "White Sugar 50kg",
        code: "DRY-SUGAR-WHT-50",
        default_order: { unit_id: "u-005", unit_name: "Bag" },
      },
      {
        id: "prod-024",
        product_id: "p-024",
        name: "Cooking Oil 18L",
        code: "DRY-OIL-COOK-18",
        default_order: { unit_id: "u-006", unit_name: "Tin" },
      },
      {
        id: "prod-025",
        product_id: "p-025",
        name: "Dried Pasta 5kg",
        code: "DRY-PASTA-5",
        default_order: { unit_id: "u-007", unit_name: "Box" },
      },
    ],
    rfps: [
      {
        id: "rpl-003",
        name: "Monthly Dry Goods Pricing",
        status: "completed",
        priority: "medium",
        description: "Regular monthly price update for dry goods inventory",
        created_at: new Date("2024-12-28"),
        res_rate: 100,
        count_vendors: 3,
      },
      {
        id: "rpl-007",
        name: "November Dry Goods Update",
        status: "completed",
        priority: "medium",
        description: "November monthly update",
        created_at: new Date("2024-11-28"),
        res_rate: 100,
        count_vendors: 3,
      },
    ],
  },

  // Detail #4 - Fresh Produce
  {
    id: "plt-004",
    name: "Fresh Produce Quick Quote",
    status: "draft",
    description: "Fast-turnaround template for fresh produce weekly pricing",
    vendor_instructions: "Urgent: Prices needed by Friday EOD.",
    validity_period: 7,
    created_at: new Date("2025-01-15"),
    updated_at: new Date("2025-01-15"),
    currency: {
      id: "curr-001",
      code: "THB",
    },
    products: [
      {
        id: "prod-031",
        product_id: "p-031",
        name: "Tomatoes 1kg",
        code: "PROD-TOM-1",
        default_order: { unit_id: "u-004", unit_name: "kg" },
      },
      {
        id: "prod-032",
        product_id: "p-032",
        name: "Lettuce Head",
        code: "PROD-LET-HD",
        default_order: { unit_id: "u-008", unit_name: "Head" },
      },
      {
        id: "prod-033",
        product_id: "p-033",
        name: "Carrots 1kg",
        code: "PROD-CAR-1",
        default_order: { unit_id: "u-004", unit_name: "kg" },
      },
      {
        id: "prod-034",
        product_id: "p-034",
        name: "Broccoli 500g",
        code: "PROD-BRO-500",
        default_order: { unit_id: "u-004", unit_name: "kg" },
      },
      {
        id: "prod-035",
        product_id: "p-035",
        name: "Bell Peppers Mixed",
        code: "PROD-PEP-MIX",
        default_order: { unit_id: "u-004", unit_name: "kg" },
      },
    ],
    rfps: [
      {
        id: "rpl-004",
        name: "Fresh Produce Weekly Update",
        status: "draft",
        priority: "high",
        description: "Weekly fresh produce price quotation request",
        created_at: new Date("2025-01-18"),
        res_rate: 0,
        count_vendors: 2,
      },
    ],
  },

  // Detail #5 - Annual Dairy
  {
    id: "plt-005",
    name: "Annual Contract Template - Dairy",
    status: "inactive",
    description: "Comprehensive annual contract negotiation template for dairy suppliers",
    vendor_instructions: "Annual contract renewal. Please review terms attached.",
    validity_period: 365,
    created_at: new Date("2024-11-01"),
    updated_at: new Date("2024-11-30"),
    currency: {
      id: "curr-001",
      code: "THB",
    },
    products: [
      {
        id: "prod-041",
        product_id: "p-041",
        name: "Fresh Milk 1L",
        code: "DAIRY-MILK-1L",
        default_order: { unit_id: "u-003", unit_name: "Bottle" },
      },
      {
        id: "prod-042",
        product_id: "p-042",
        name: "Cheddar Cheese 1kg",
        code: "DAIRY-CHE-CHED-1",
        default_order: { unit_id: "u-009", unit_name: "Block" },
      },
      {
        id: "prod-043",
        product_id: "p-043",
        name: "Greek Yogurt 500g",
        code: "DAIRY-YOG-GRK-500",
        default_order: { unit_id: "u-010", unit_name: "Tub" },
      },
      {
        id: "prod-044",
        product_id: "p-044",
        name: "Butter Unsalted 250g",
        code: "DAIRY-BUT-UNS-250",
        default_order: { unit_id: "u-009", unit_name: "Block" },
      },
      {
        id: "prod-045",
        product_id: "p-045",
        name: "Cream 35% 1L",
        code: "DAIRY-CRM-35-1L",
        default_order: { unit_id: "u-011", unit_name: "Carton" },
      },
    ],
    rfps: [
      {
        id: "rpl-005",
        name: "Annual Contract Renewal - Dairy",
        status: "inactive",
        priority: "low",
        description: "Annual price negotiation for dairy product suppliers",
        created_at: new Date("2024-12-01"),
        res_rate: 50,
        count_vendors: 4,
      },
    ],
  },

  // Detail #6 - Seasonal Produce
  {
    id: "plt-006",
    name: "Seasonal Produce Template",
    status: "active", // Changed from submit
    description: "Seasonal pricing template for fruits and vegetables",
    vendor_instructions: "Focus on seasonal availability.",
    validity_period: 120,
    created_at: new Date("2024-12-20"),
    updated_at: new Date("2025-01-18"),
    currency: {
      id: "curr-001",
      code: "THB",
    },
    products: [
      {
        id: "prod-051",
        product_id: "p-051",
        name: "Strawberries 250g",
        code: "FRUIT-STR-250",
        default_order: { unit_id: "u-012", unit_name: "Punnet" },
      },
      {
        id: "prod-052",
        product_id: "p-052",
        name: "Mango 1kg",
        code: "FRUIT-MAN-1",
        default_order: { unit_id: "u-004", unit_name: "kg" },
      },
      {
        id: "prod-053",
        product_id: "p-053",
        name: "Durian 1pc",
        code: "FRUIT-DUR-1PC",
        default_order: { unit_id: "u-013", unit_name: "Piece" },
      },
      {
        id: "prod-054",
        product_id: "p-054",
        name: "Dragon Fruit 1kg",
        code: "FRUIT-DRA-1",
        default_order: { unit_id: "u-004", unit_name: "kg" },
      },
      {
        id: "prod-055",
        product_id: "p-055",
        name: "Longan 1kg",
        code: "FRUIT-LON-1",
        default_order: { unit_id: "u-004", unit_name: "kg" },
      },
    ],
    rfps: [
      {
        id: "rpl-008",
        name: "Winter Fruit Campaign 2025",
        status: "submit",
        priority: "high",
        description: "Winter seasonal fruit pricing campaign",
        created_at: new Date("2025-01-10"),
        res_rate: 75,
        count_vendors: 4,
      },
      {
        id: "rpl-009",
        name: "Summer Fruit Preview",
        status: "draft",
        priority: "medium",
        description: "Early pricing for summer fruit season",
        created_at: new Date("2025-01-18"),
        res_rate: 0,
        count_vendors: 2,
      },
    ],
  },
];

// ============================================================================
// Helper Function - Get Mock Detail by ID
// ============================================================================
export const getMockPriceListTemplateById = (
  id: string
): PriceListTemplateDetailsDto | undefined => {
  return mockPriceListTemplateDetails.find((detail) => detail.id === id);
};
