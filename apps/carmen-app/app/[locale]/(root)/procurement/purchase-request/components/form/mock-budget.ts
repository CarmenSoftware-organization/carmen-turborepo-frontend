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
  {
    id: "bg-4",
    location: "Location 4",
    category: "Category 4",
    total_budget: 120000,
    soft_commitment: {
      dept_head: 5000,
      form_po: 4000,
    },
    hard_commitment: 10000,
    current_pr_amount: 30000,
    available_budget: 71000,
    status: "Within Budget",
  },
  {
    id: "bg-5",
    location: "Location 5",
    category: "Category 5",
    total_budget: 50000,
    soft_commitment: {
      dept_head: 3000,
      form_po: 2000,
    },
    hard_commitment: 5000,
    current_pr_amount: 46000,
    available_budget: -4000,
    status: "Over Budget",
  },
];
