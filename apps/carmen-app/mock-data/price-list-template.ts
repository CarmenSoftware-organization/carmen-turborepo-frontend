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
    valid_period: 90,
    create_date: new Date("2024-12-01"),
    update_date: new Date("2025-01-10"),
  },
  {
    id: "plt-002",
    name: "Meat & Seafood Premium Template",
    status: "active",
    description: "Premium template for high-value meat and seafood products",
    valid_period: 60,
    create_date: new Date("2024-12-15"),
    update_date: new Date("2025-01-15"),
  },
  {
    id: "plt-003",
    name: "Monthly Dry Goods Template",
    status: "completed",
    description: "Monthly recurring template for dry goods inventory",
    valid_period: 30,
    create_date: new Date("2024-11-01"),
    update_date: new Date("2024-12-28"),
  },
  {
    id: "plt-004",
    name: "Fresh Produce Quick Quote",
    status: "draft",
    description: "Fast-turnaround template for fresh produce weekly pricing",
    valid_period: 7,
    create_date: new Date("2025-01-15"),
    update_date: new Date("2025-01-15"),
  },
  {
    id: "plt-005",
    name: "Annual Contract Template - Dairy",
    status: "inactive",
    description: "Comprehensive annual contract negotiation template for dairy suppliers",
    valid_period: 365,
    create_date: new Date("2024-11-01"),
    update_date: new Date("2024-11-30"),
  },
  {
    id: "plt-006",
    name: "Seasonal Produce Template",
    status: "submit",
    description: "Seasonal pricing template for fruits and vegetables",
    valid_period: 120,
    create_date: new Date("2024-12-20"),
    update_date: new Date("2025-01-18"),
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
    valid_period: 90,
    create_date: new Date("2024-12-01"),
    update_date: new Date("2025-01-10"),
    currency: {
      id: "curr-001",
      code: "THB",
    },
    products: [
      {
        id: "prod-001",
        name: "Coca-Cola 330ml",
        code: "BEV-COLA-330",
      },
      {
        id: "prod-002",
        name: "Pepsi 330ml",
        code: "BEV-PEPSI-330",
      },
      {
        id: "prod-003",
        name: "Sprite 330ml",
        code: "BEV-SPRITE-330",
      },
      {
        id: "prod-004",
        name: "Orange Juice 1L",
        code: "BEV-OJ-1000",
      },
      {
        id: "prod-005",
        name: "Mineral Water 500ml",
        code: "BEV-WATER-500",
      },
    ],
    campaigns: [
      {
        id: "rpl-001",
        name: "Q1 2025 Beverage Price Request",
        status: "active",
        priority: "high",
        description: "Quarterly price request for all beverage categories",
        create_date: new Date("2025-01-01"),
        res_rate: 66.67,
        count_vendors: 3,
      },
      {
        id: "rpl-006",
        name: "Q4 2024 Beverage Review",
        status: "completed",
        priority: "medium",
        description: "End of year beverage pricing review",
        create_date: new Date("2024-10-01"),
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
    valid_period: 60,
    create_date: new Date("2024-12-15"),
    update_date: new Date("2025-01-15"),
    currency: {
      id: "curr-001",
      code: "THB",
    },
    products: [
      {
        id: "prod-011",
        name: "Australian Beef Ribeye",
        code: "MEAT-BEEF-RIB",
      },
      {
        id: "prod-012",
        name: "Norwegian Salmon Fillet",
        code: "FISH-SALM-FIL",
      },
      {
        id: "prod-013",
        name: "Premium Pork Loin",
        code: "MEAT-PORK-LOIN",
      },
      {
        id: "prod-014",
        name: "Fresh Tiger Prawns",
        code: "FISH-PRAWN-TIG",
      },
      {
        id: "prod-015",
        name: "Sea Bass Whole",
        code: "FISH-BASS-WHL",
      },
    ],
    campaigns: [
      {
        id: "rpl-002",
        name: "Meat & Seafood Special Campaign",
        status: "submit",
        priority: "high",
        description: "Special promotional campaign for premium meat products",
        create_date: new Date("2025-01-05"),
        res_rate: 80,
        count_vendors: 5,
      },
    ],
  },

  // Detail #3 - Monthly Dry Goods
  {
    id: "plt-003",
    name: "Monthly Dry Goods Template",
    status: "completed",
    description: "Monthly recurring template for dry goods inventory",
    valid_period: 30,
    create_date: new Date("2024-11-01"),
    update_date: new Date("2024-12-28"),
    currency: {
      id: "curr-001",
      code: "THB",
    },
    products: [
      {
        id: "prod-021",
        name: "Jasmine Rice 25kg",
        code: "DRY-RICE-JAS-25",
      },
      {
        id: "prod-022",
        name: "All Purpose Flour 10kg",
        code: "DRY-FLOUR-AP-10",
      },
      {
        id: "prod-023",
        name: "White Sugar 50kg",
        code: "DRY-SUGAR-WHT-50",
      },
      {
        id: "prod-024",
        name: "Cooking Oil 18L",
        code: "DRY-OIL-COOK-18",
      },
      {
        id: "prod-025",
        name: "Dried Pasta 5kg",
        code: "DRY-PASTA-5",
      },
    ],
    campaigns: [
      {
        id: "rpl-003",
        name: "Monthly Dry Goods Pricing",
        status: "completed",
        priority: "medium",
        description: "Regular monthly price update for dry goods inventory",
        create_date: new Date("2024-12-28"),
        res_rate: 100,
        count_vendors: 3,
      },
      {
        id: "rpl-007",
        name: "November Dry Goods Update",
        status: "completed",
        priority: "medium",
        description: "November monthly update",
        create_date: new Date("2024-11-28"),
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
    valid_period: 7,
    create_date: new Date("2025-01-15"),
    update_date: new Date("2025-01-15"),
    currency: {
      id: "curr-001",
      code: "THB",
    },
    products: [
      {
        id: "prod-031",
        name: "Tomatoes 1kg",
        code: "PROD-TOM-1",
      },
      {
        id: "prod-032",
        name: "Lettuce Head",
        code: "PROD-LET-HD",
      },
      {
        id: "prod-033",
        name: "Carrots 1kg",
        code: "PROD-CAR-1",
      },
      {
        id: "prod-034",
        name: "Broccoli 500g",
        code: "PROD-BRO-500",
      },
      {
        id: "prod-035",
        name: "Bell Peppers Mixed",
        code: "PROD-PEP-MIX",
      },
    ],
    campaigns: [
      {
        id: "rpl-004",
        name: "Fresh Produce Weekly Update",
        status: "draft",
        priority: "high",
        description: "Weekly fresh produce price quotation request",
        create_date: new Date("2025-01-18"),
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
    valid_period: 365,
    create_date: new Date("2024-11-01"),
    update_date: new Date("2024-11-30"),
    currency: {
      id: "curr-001",
      code: "THB",
    },
    products: [
      {
        id: "prod-041",
        name: "Fresh Milk 1L",
        code: "DAIRY-MILK-1L",
      },
      {
        id: "prod-042",
        name: "Cheddar Cheese 1kg",
        code: "DAIRY-CHE-CHED-1",
      },
      {
        id: "prod-043",
        name: "Greek Yogurt 500g",
        code: "DAIRY-YOG-GRK-500",
      },
      {
        id: "prod-044",
        name: "Butter Unsalted 250g",
        code: "DAIRY-BUT-UNS-250",
      },
      {
        id: "prod-045",
        name: "Cream 35% 1L",
        code: "DAIRY-CRM-35-1L",
      },
    ],
    campaigns: [
      {
        id: "rpl-005",
        name: "Annual Contract Renewal - Dairy",
        status: "inactive",
        priority: "low",
        description: "Annual price negotiation for dairy product suppliers",
        create_date: new Date("2024-12-01"),
        res_rate: 50,
        count_vendors: 4,
      },
    ],
  },

  // Detail #6 - Seasonal Produce
  {
    id: "plt-006",
    name: "Seasonal Produce Template",
    status: "submit",
    description: "Seasonal pricing template for fruits and vegetables",
    valid_period: 120,
    create_date: new Date("2024-12-20"),
    update_date: new Date("2025-01-18"),
    currency: {
      id: "curr-001",
      code: "THB",
    },
    products: [
      {
        id: "prod-051",
        name: "Strawberries 250g",
        code: "FRUIT-STR-250",
      },
      {
        id: "prod-052",
        name: "Mango 1kg",
        code: "FRUIT-MAN-1",
      },
      {
        id: "prod-053",
        name: "Durian 1pc",
        code: "FRUIT-DUR-1PC",
      },
      {
        id: "prod-054",
        name: "Dragon Fruit 1kg",
        code: "FRUIT-DRA-1",
      },
      {
        id: "prod-055",
        name: "Longan 1kg",
        code: "FRUIT-LON-1",
      },
    ],
    campaigns: [
      {
        id: "rpl-008",
        name: "Winter Fruit Campaign 2025",
        status: "submit",
        priority: "high",
        description: "Winter seasonal fruit pricing campaign",
        create_date: new Date("2025-01-10"),
        res_rate: 75,
        count_vendors: 4,
      },
      {
        id: "rpl-009",
        name: "Summer Fruit Preview",
        status: "draft",
        priority: "medium",
        description: "Early pricing for summer fruit season",
        create_date: new Date("2025-01-18"),
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
