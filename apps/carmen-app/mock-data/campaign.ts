import { CampaignDto, CampaignDetailDto } from "@/dtos/campaign.dto";

export const mockCampaigns: CampaignDto[] = [
  {
    id: "rpl-001",
    name: "Q1 2025 Beverage Price Request",
    status: "active",
    description: "Quarterly price request for all beverage categories",
    valid_period: new Date("2025-03-31"),
    create_date: new Date("2025-01-01"),
    update_date: new Date("2025-01-15"),
  },
  {
    id: "rpl-002",
    name: "Meat & Seafood Special Campaign",
    status: "submit",
    description: "Special promotional campaign for premium meat products",
    valid_period: new Date("2025-02-28"),
    create_date: new Date("2025-01-05"),
    update_date: new Date("2025-01-20"),
  },
  {
    id: "rpl-003",
    name: "Monthly Dry Goods Pricing",
    status: "completed",
    description: "Regular monthly price update for dry goods inventory",
    valid_period: new Date("2025-01-31"),
    create_date: new Date("2024-12-28"),
    update_date: new Date("2025-01-10"),
  },
  {
    id: "rpl-004",
    name: "Fresh Produce Weekly Update",
    status: "draft",
    description: "Weekly fresh produce price quotation request",
    valid_period: new Date("2025-01-24"),
    create_date: new Date("2025-01-18"),
    update_date: new Date("2025-01-18"),
  },
  {
    id: "rpl-005",
    name: "Annual Contract Renewal - Dairy",
    status: "inactive",
    description: "Annual price negotiation for dairy product suppliers",
    valid_period: new Date("2025-12-31"),
    create_date: new Date("2024-12-01"),
    update_date: new Date("2024-12-15"),
  },
];

// ============================================================================
// Mock Data - Detail View (Array of Full Details)
// ============================================================================
export const mockCampaignDetails: CampaignDetailDto[] = [
  // Detail #1 - Q1 2025 Beverage
  {
    id: "rpl-001",
    name: "Q1 2025 Beverage Price Request",
    status: "active",
    description: "Quarterly price request for all beverage categories",
    valid_period: new Date("2025-03-31"),
    create_date: new Date("2025-01-01"),
    update_date: new Date("2025-01-15"),
    template: {
      id: "template-001",
      name: "Standard Beverage Price Template",
      start_date: new Date("2025-01-10"),
      end_date: new Date("2025-01-24"),
      created: {
        user: "John Smith",
        date: new Date("2024-12-20"),
      },
    },
    performance: {
      res_rate: 66.67,
      avg_time: 4.5,
      comp_rate: 33.33,
      submission: "2/3",
    },
    vendor: [
      {
        id: "vendor-001",
        name: "Thai Beverage Wholesale Co., Ltd.",
        email: "sales@thaibev.com",
        status: "completed",
        progress: 100,
        last_activity: new Date("2025-01-14"),
        is_send: true,
      },
      {
        id: "vendor-002",
        name: "Premium Drinks Supplier",
        email: "info@premiumdrinks.co.th",
        status: "in_progress",
        progress: 65,
        last_activity: new Date("2025-01-15"),
        is_send: true,
      },
      {
        id: "vendor-003",
        name: "Bangkok Beverage Distribution",
        email: "contact@bkk-beverage.com",
        status: "pending",
        progress: 0,
        last_activity: new Date("2025-01-10"),
        is_send: true,
      },
    ],
    settings: {
      portal_duration: 14,
      campaign_type: "buy",
      submission_method: "auto",
      require_approval: true,
      auto_reminder: true,
      priority: "high",
      instructions:
        "Please provide your best pricing for Q1 2025. Include volume discounts for orders over 1000 units. Delivery terms should be FOB Bangkok.",
      reminders: [
        {
          type: "before_deadline",
          days: 3,
          recipients: [
            { type: "email", value: "vendor@example.com" },
            { type: "role", value: "vendor_manager" },
          ],
          message: "Reminder: Price submission deadline in 3 days",
          enabled: true,
        },
        {
          type: "before_deadline",
          days: 1,
          recipients: [{ type: "email", value: "vendor@example.com" }],
          message: "Final reminder: Price submission deadline tomorrow",
          enabled: true,
        },
      ],
      escalations: [
        {
          type: "after_deadline",
          days: 1,
          recipients: [
            { type: "role", value: "procurement_manager" },
            { type: "user_id", value: "user-pm-001" },
          ],
          message: "Vendor has not submitted pricing after deadline",
          enabled: true,
        },
      ],
    },
  },
  // Detail #2 - Meat & Seafood Campaign
  {
    id: "rpl-002",
    name: "Meat & Seafood Special Campaign",
    status: "submit",
    description: "Special promotional campaign for premium meat products",
    valid_period: new Date("2025-02-28"),
    create_date: new Date("2025-01-05"),
    update_date: new Date("2025-01-20"),
    template: {
      id: "template-002",
      name: "Meat & Seafood Campaign Template",
      start_date: new Date("2025-01-15"),
      end_date: new Date("2025-02-05"),
      created: {
        user: "Sarah Johnson",
        date: new Date("2025-01-03"),
      },
    },
    performance: {
      res_rate: 80,
      avg_time: 3.2,
      comp_rate: 40,
      submission: "4/5",
    },
    vendor: [
      {
        id: "vendor-004",
        name: "Prime Meat Suppliers Ltd.",
        email: "sales@primemeat.co.th",
        status: "completed",
        progress: 100,
        last_activity: new Date("2025-01-18"),
        is_send: true,
      },
      {
        id: "vendor-005",
        name: "Ocean Fresh Seafood",
        email: "info@oceanfresh.com",
        status: "completed",
        progress: 100,
        last_activity: new Date("2025-01-19"),
        is_send: true,
      },
      {
        id: "vendor-006",
        name: "Bangkok Frozen Foods",
        email: "contact@bkkfrozen.co.th",
        status: "in_progress",
        progress: 75,
        last_activity: new Date("2025-01-20"),
        is_send: true,
      },
      {
        id: "vendor-007",
        name: "Premium Protein Co.",
        email: "sales@premiumprotein.com",
        status: "in_progress",
        progress: 50,
        last_activity: new Date("2025-01-19"),
        is_send: true,
      },
      {
        id: "vendor-008",
        name: "Thai Seafood Export",
        email: "export@thaiseafood.co.th",
        status: "pending",
        progress: 0,
        last_activity: new Date("2025-01-15"),
        is_send: true,
      },
    ],
    settings: {
      portal_duration: 21,
      campaign_type: "recurring",
      submission_method: "manual",
      require_approval: true,
      auto_reminder: true,
      priority: "high",
      instructions:
        "Special campaign pricing required. Please provide:\n1. Regular pricing\n2. Volume discount tiers (500+, 1000+, 2000+ units)\n3. Promotional pricing for campaign period\n4. Delivery terms and lead times",
      reminders: [
        {
          type: "before_deadline",
          days: 7,
          recipients: [{ type: "email", value: "vendor@example.com" }],
          message: "Price submission deadline in 7 days - Campaign pricing",
          enabled: true,
        },
        {
          type: "before_deadline",
          days: 3,
          recipients: [
            { type: "email", value: "vendor@example.com" },
            { type: "role", value: "category_manager" },
          ],
          message: "Reminder: Campaign price submission due in 3 days",
          enabled: true,
        },
      ],
      escalations: [
        {
          type: "after_deadline",
          days: 2,
          recipients: [
            { type: "role", value: "procurement_director" },
            { type: "user_id", value: "user-dir-001" },
          ],
          message: "Campaign pricing not submitted - requires immediate action",
          enabled: true,
        },
      ],
    },
  },
  // Detail #3 - Monthly Dry Goods
  {
    id: "rpl-003",
    name: "Monthly Dry Goods Pricing",
    status: "completed",
    description: "Regular monthly price update for dry goods inventory",
    valid_period: new Date("2025-01-31"),
    create_date: new Date("2024-12-28"),
    update_date: new Date("2025-01-10"),
    template: {
      id: "template-003",
      name: "Standard Dry Goods Template",
      start_date: new Date("2024-12-28"),
      end_date: new Date("2025-01-10"),
      created: {
        user: "Michael Chen",
        date: new Date("2024-12-20"),
      },
    },
    performance: {
      res_rate: 100,
      avg_time: 2.8,
      comp_rate: 100,
      submission: "3/3",
    },
    vendor: [
      {
        id: "vendor-009",
        name: "Thai Dry Goods Supplier",
        email: "sales@thaidrygoods.co.th",
        status: "completed",
        progress: 100,
        last_activity: new Date("2025-01-08"),
        is_send: true,
      },
      {
        id: "vendor-010",
        name: "Global Food Distributors",
        email: "info@globalfood.com",
        status: "completed",
        progress: 100,
        last_activity: new Date("2025-01-07"),
        is_send: true,
      },
      {
        id: "vendor-011",
        name: "Asia Pacific Trading",
        email: "contact@aptrading.co.th",
        status: "completed",
        progress: 100,
        last_activity: new Date("2025-01-09"),
        is_send: true,
      },
    ],
    settings: {
      portal_duration: 14,
      campaign_type: "buy",
      submission_method: "auto",
      require_approval: false,
      auto_reminder: true,
      priority: "medium",
      instructions:
        "Monthly standard pricing update for dry goods categories including rice, flour, sugar, and cooking oil. Please provide FOB pricing.",
      reminders: [
        {
          type: "before_deadline",
          days: 5,
          recipients: [{ type: "email", value: "vendor@example.com" }],
          message: "Monthly price update deadline in 5 days",
          enabled: true,
        },
      ],
      escalations: [],
    },
  },
  // Detail #4 - Fresh Produce Weekly
  {
    id: "rpl-004",
    name: "Fresh Produce Weekly Update",
    status: "draft",
    description: "Weekly fresh produce price quotation request",
    valid_period: new Date("2025-01-24"),
    create_date: new Date("2025-01-18"),
    update_date: new Date("2025-01-18"),
    template: {
      id: "template-004",
      name: "Weekly Fresh Produce Template",
      start_date: new Date("2025-01-18"),
      end_date: new Date("2025-01-22"),
      created: {
        user: "Emma Wilson",
        date: new Date("2025-01-15"),
      },
    },
    vendor: [
      {
        id: "vendor-012",
        name: "Fresh Farm Produce Ltd.",
        email: "orders@freshfarm.co.th",
        status: "pending",
        progress: 0,
        last_activity: new Date("2025-01-18"),
        is_send: false,
      },
      {
        id: "vendor-013",
        name: "Green Valley Suppliers",
        email: "sales@greenvalley.com",
        status: "pending",
        progress: 0,
        last_activity: new Date("2025-01-18"),
        is_send: false,
      },
    ],
    settings: {
      portal_duration: 4,
      campaign_type: "buy",
      submission_method: "auto",
      require_approval: false,
      auto_reminder: true,
      priority: "high",
      instructions:
        "Weekly fresh produce pricing. Quick turnaround required due to product freshness. Please submit by Wednesday noon.",
      reminders: [
        {
          type: "before_deadline",
          days: 1,
          recipients: [{ type: "email", value: "vendor@example.com" }],
          message: "Fresh produce price submission due tomorrow",
          enabled: true,
        },
      ],
      escalations: [
        {
          type: "after_deadline",
          days: 1,
          recipients: [{ type: "role", value: "category_manager" }],
          message: "Fresh produce pricing overdue",
          enabled: true,
        },
      ],
    },
  },
  // Detail #5 - Annual Dairy Contract
  {
    id: "rpl-005",
    name: "Annual Contract Renewal - Dairy",
    status: "inactive",
    description: "Annual price negotiation for dairy product suppliers",
    valid_period: new Date("2025-12-31"),
    create_date: new Date("2024-12-01"),
    update_date: new Date("2024-12-15"),
    template: {
      id: "template-005",
      name: "Annual Contract Renewal Template",
      start_date: new Date("2024-12-01"),
      end_date: new Date("2024-12-31"),
      created: {
        user: "David Thompson",
        date: new Date("2024-11-15"),
      },
    },
    performance: {
      res_rate: 50,
      avg_time: 8.5,
      comp_rate: 25,
      submission: "1/4",
    },
    vendor: [
      {
        id: "vendor-014",
        name: "Premium Dairy Products Co.",
        email: "contracts@premiumdairy.co.th",
        status: "completed",
        progress: 100,
        last_activity: new Date("2024-12-12"),
        is_send: true,
      },
      {
        id: "vendor-015",
        name: "Thai Milk Cooperative",
        email: "info@thaimilk.co.th",
        status: "in_progress",
        progress: 40,
        last_activity: new Date("2024-12-10"),
        is_send: true,
      },
      {
        id: "vendor-016",
        name: "Fresh Dairy Suppliers",
        email: "sales@freshdairy.com",
        status: "pending",
        progress: 0,
        last_activity: new Date("2024-12-05"),
        is_send: true,
      },
      {
        id: "vendor-017",
        name: "International Dairy Trading",
        email: "contact@intdairy.com",
        status: "pending",
        progress: 0,
        last_activity: new Date("2024-12-03"),
        is_send: true,
      },
    ],
    settings: {
      portal_duration: 30,
      campaign_type: "recurring",
      submission_method: "manual",
      require_approval: true,
      auto_reminder: true,
      priority: "low",
      instructions:
        "Annual contract renewal for dairy products. Please provide:\n1. 12-month pricing forecast\n2. Volume commitment discounts\n3. Quality assurance documentation\n4. Delivery schedule and terms\n5. Payment terms proposal",
      reminders: [
        {
          type: "before_deadline",
          days: 14,
          recipients: [
            { type: "email", value: "vendor@example.com" },
            { type: "role", value: "strategic_sourcing" },
          ],
          message: "Annual contract renewal deadline in 14 days",
          enabled: true,
        },
        {
          type: "before_deadline",
          days: 7,
          recipients: [{ type: "email", value: "vendor@example.com" }],
          message: "Final reminder: Contract renewal due in 7 days",
          enabled: true,
        },
      ],
      escalations: [
        {
          type: "after_deadline",
          days: 3,
          recipients: [
            { type: "role", value: "procurement_director" },
            { type: "user_id", value: "user-dir-001" },
          ],
          message: "Annual contract renewal overdue - immediate action required",
          enabled: true,
        },
      ],
    },
  },
];

// ============================================================================
// Helper Function - Get Mock Detail by ID
// ============================================================================
export const getMockCampaignById = (id: string): CampaignDetailDto | undefined => {
  return mockCampaignDetails.find((detail) => detail.id === id);
};
