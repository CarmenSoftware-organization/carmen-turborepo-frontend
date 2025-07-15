export type BudgetItem = {
  id: string;
  location: string;
  category: string;
  total_budget: number;
  soft_commitment: {
    dept_head: number;
    form_po: number;
  };
  hard_commitment: number;
  available_budget: number;
  current_pr_amount: number;
  status: "Over Budget" | "Within Budget";
};

export const mockBgData: BudgetItem[] = [
  {
    id: "bg-1",
    location: "Location 1",
    category: "Category 1",
    total_budget: 100000,
    soft_commitment: {
      dept_head: 1000,
      form_po: 2000,
    },
    hard_commitment: 5000,
    current_pr_amount: 10000,
    available_budget: 82000, // 100000 - (1000+2000+5000+10000)
    status: "Within Budget",
  },
  {
    id: "bg-2",
    location: "Location 2",
    category: "Category 2",
    total_budget: 75000,
    soft_commitment: {
      dept_head: 3000,
      form_po: 2500,
    },
    hard_commitment: 7000,
    current_pr_amount: 10000,
    available_budget: 52500,
    status: "Within Budget",
  },
  {
    id: "bg-3",
    location: "Location 3",
    category: "Category 3",
    total_budget: 60000,
    soft_commitment: {
      dept_head: 2000,
      form_po: 3000,
    },
    hard_commitment: 5000,
    current_pr_amount: 52000,
    available_budget: -4000,
    status: "Over Budget",
  },
];

interface PricelistItem {
  id: string;
  vendor_name: string;
  preferred: boolean;
  rating: number;
  description?: string;
  start_date: string;
  end_date: string;
  pl_no: string;
  currency: string;
  price: number;
  unit: string;
  min_qty: number;
  base_unit: string;
  expire_date: number;
}


export const mockPricelistItems: PricelistItem[] = [
  {
    id: '06fsgG',
    vendor_name: 'Acme Supplies',
    preferred: true,
    rating: 4.5,
    description: 'High-quality office supplies.',
    start_date: '2025-07-01',
    end_date: '2025-12-31',
    pl_no: 'PL-ACME-2025',
    currency: 'USD',
    price: 25.5,
    unit: 'box',
    min_qty: 10,
    base_unit: 'piece',
    expire_date: 3,
  },
  {
    id: 'BmESjn',
    vendor_name: 'Global Industrial',
    preferred: false,
    rating: 3.8,
    description: 'Bulk industrial parts.',
    start_date: '2025-06-15',
    end_date: '2025-11-30',
    pl_no: 'PL-GLOBAL-2025',
    currency: 'EUR',
    price: 102.99,
    unit: 'set',
    min_qty: 5,
    base_unit: 'unit',
    expire_date: 2,
  },
  {
    id: 'Iku7jI',
    vendor_name: 'TechGear Inc.',
    preferred: true,
    rating: 4.9,
    start_date: '2025-08-01',
    end_date: '2026-01-31',
    pl_no: 'PL-TECH-2025',
    currency: 'USD',
    price: 199.99,
    unit: 'kit',
    min_qty: 1,
    base_unit: 'kit',
    expire_date: 3,
  },
  {
    id: 'WoNLzb',
    vendor_name: 'Eco Packaging',
    preferred: false,
    rating: 4.0,
    description: 'Sustainable packaging solutions.',
    start_date: '2025-05-01',
    end_date: '2025-10-31',
    pl_no: 'PL-ECO-2025',
    currency: 'GBP',
    price: 12.75,
    unit: 'roll',
    min_qty: 20,
    base_unit: 'meter',
    expire_date: 2,
  },
  {
    id: 'r_BQFj',
    vendor_name: 'Eco',
    preferred: false,
    rating: 4.0,
    description: 'packaging',
    start_date: '2025-05-01',
    end_date: '2025-10-31',
    pl_no: 'PL-ECO-2025',
    currency: 'USD',
    price: 12.75,
    unit: 'roll',
    min_qty: 20,
    base_unit: 'meter',
    expire_date: 10,
  },
];
