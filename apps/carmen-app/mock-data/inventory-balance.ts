export const mockInventoryBalanceSummaryCard = {
  total_item: 4453.22,
  total_value: 10152.74,
  valuation_method: "Weighted Avg",
};

export type Item = {
  id: string;
  code: string;
  name: string;
  unit: string;
  unit_cost: number;
  value: number;
};

export type SubItem = {
  name: string;
  description: string;
  total_item_quantity: number;
  items: Item[];
};

export type BalanceReport = {
  id: string;
  code: string;
  name: string;
  sub_item?: SubItem[]; // ไม่จำเป็นต้องมีทุกอัน
};

export const mockBalanceReport: BalanceReport[] = [
  {
    id: "br-1",
    code: "wh-001",
    name: "Main Warehouse",
    sub_item: [
      {
        name: "Produce",
        description: "Fresh fruits and vegetables",
        total_item_quantity: 1500,
        items: [
          { id: "pr-1", code: "P-1001", name: "Apple", unit: "kg", unit_cost: 2.2, value: 2200 },
          { id: "pr-2", code: "P-1002", name: "Banana", unit: "kg", unit_cost: 1.8, value: 1800 },
          { id: "pr-3", code: "P-1003", name: "Carrot", unit: "kg", unit_cost: 1.5, value: 1500 },
        ],
      },
      {
        name: "Dairy",
        description: "Milk, cheese, and other dairy products",
        total_item_quantity: 800,
        items: [
          { id: "da-1", code: "D-2001", name: "Milk", unit: "litre", unit_cost: 1.1, value: 880 },
          { id: "da-2", code: "D-2002", name: "Cheese", unit: "kg", unit_cost: 5.5, value: 2750 },
        ],
      },
    ],
  },
  {
    id: "br-2",
    code: "kc-002",
    name: "Kitchen Storage",
    sub_item: [
      {
        name: "Dry Goods",
        description: "Rice, beans, pasta, etc.",
        total_item_quantity: 1200,
        items: [
          { id: "dg-1", code: "DG-3001", name: "Rice", unit: "kg", unit_cost: 1.0, value: 600 },
          { id: "dg-2", code: "DG-3002", name: "Pasta", unit: "kg", unit_cost: 1.2, value: 720 },
        ],
      },
      {
        name: "Canned Goods",
        description: "Canned foods and ready-to-eat items",
        total_item_quantity: 450,
        items: [
          {
            id: "cg-1",
            code: "CG-3101",
            name: "Baked Beans",
            unit: "can",
            unit_cost: 1.5,
            value: 300,
          },
          { id: "cg-2", code: "CG-3102", name: "Corn", unit: "can", unit_cost: 1.3, value: 260 },
        ],
      },
    ],
  },
  {
    id: "br-3",
    code: "bv-003",
    name: "Bakery",
    sub_item: [
      {
        name: "Bakery Items",
        description: "Bread, cake, pastry",
        total_item_quantity: 950,
        items: [
          { id: "bk-1", code: "BK-4001", name: "Bread", unit: "pcs", unit_cost: 1.5, value: 750 },
          {
            id: "bk-2",
            code: "BK-4002",
            name: "Croissant",
            unit: "pcs",
            unit_cost: 2.0,
            value: 400,
          },
        ],
      },
    ],
  },
  {
    id: "br-4",
    code: "frz-004",
    name: "Freezer Section",
    sub_item: [
      {
        name: "Frozen Meats",
        description: "Beef, pork, chicken",
        total_item_quantity: 700,
        items: [
          {
            id: "fm-1",
            code: "FM-5001",
            name: "Chicken Breast",
            unit: "kg",
            unit_cost: 3.5,
            value: 1050,
          },
          {
            id: "fm-2",
            code: "FM-5002",
            name: "Pork Chop",
            unit: "kg",
            unit_cost: 4.2,
            value: 840,
          },
        ],
      },
      {
        name: "Ice Cream",
        description: "Various ice cream flavors",
        total_item_quantity: 300,
        items: [
          {
            id: "ic-1",
            code: "IC-5101",
            name: "Vanilla",
            unit: "litre",
            unit_cost: 2.5,
            value: 625,
          },
          {
            id: "ic-2",
            code: "IC-5102",
            name: "Chocolate",
            unit: "litre",
            unit_cost: 2.5,
            value: 625,
          },
        ],
      },
    ],
  },
  {
    id: "br-5",
    code: "bev-005",
    name: "Beverage Section",
    sub_item: [
      {
        name: "Soft Drinks",
        description: "Sodas and sparkling water",
        total_item_quantity: 600,
        items: [
          { id: "sd-1", code: "SD-6001", name: "Coke", unit: "bottle", unit_cost: 1.0, value: 300 },
          {
            id: "sd-2",
            code: "SD-6002",
            name: "Sprite",
            unit: "bottle",
            unit_cost: 1.0,
            value: 300,
          },
        ],
      },
      {
        name: "Juices",
        description: "Fruit and vegetable juices",
        total_item_quantity: 500,
        items: [
          {
            id: "ju-1",
            code: "JU-6101",
            name: "Orange Juice",
            unit: "litre",
            unit_cost: 2.0,
            value: 500,
          },
          {
            id: "ju-2",
            code: "JU-6102",
            name: "Carrot Juice",
            unit: "litre",
            unit_cost: 2.0,
            value: 500,
          },
        ],
      },
    ],
  },
  {
    id: "br-6",
    code: "snk-006",
    name: "Snack Area",
    sub_item: [
      {
        name: "Chips",
        description: "Potato chips, corn chips",
        total_item_quantity: 400,
        items: [
          {
            id: "ch-1",
            code: "CH-7001",
            name: "Potato Chips",
            unit: "bag",
            unit_cost: 1.5,
            value: 300,
          },
          {
            id: "ch-2",
            code: "CH-7002",
            name: "Corn Chips",
            unit: "bag",
            unit_cost: 1.5,
            value: 300,
          },
        ],
      },
      {
        name: "Cookies",
        description: "Biscuits and cookies",
        total_item_quantity: 350,
        items: [
          {
            id: "co-1",
            code: "CO-7101",
            name: "Chocolate Chip Cookies",
            unit: "pack",
            unit_cost: 2.0,
            value: 400,
          },
        ],
      },
    ],
  },
  {
    id: "br-7",
    code: "hlh-007",
    name: "Health & Hygiene",
    sub_item: [
      {
        name: "Personal Care",
        description: "Soap, shampoo, toothpaste",
        total_item_quantity: 300,
        items: [
          {
            id: "pc-1",
            code: "PC-8001",
            name: "Shampoo",
            unit: "bottle",
            unit_cost: 3.5,
            value: 525,
          },
          {
            id: "pc-2",
            code: "PC-8002",
            name: "Toothpaste",
            unit: "tube",
            unit_cost: 2.0,
            value: 200,
          },
        ],
      },
    ],
  },
  {
    id: "br-8",
    code: "ofc-008",
    name: "Office Supplies",
    sub_item: [
      {
        name: "Stationery",
        description: "Paper, pens, envelopes",
        total_item_quantity: 400,
        items: [
          {
            id: "st-1",
            code: "ST-9001",
            name: "A4 Paper",
            unit: "ream",
            unit_cost: 4.0,
            value: 400,
          },
          { id: "st-2", code: "ST-9002", name: "Pen", unit: "box", unit_cost: 2.5, value: 250 },
        ],
      },
    ],
  },
  {
    id: "br-9",
    code: "out-009",
    name: "Outdoor Storage",
    sub_item: [
      {
        name: "Garden Supplies",
        description: "Tools and soil",
        total_item_quantity: 200,
        items: [
          {
            id: "gs-1",
            code: "GS-10001",
            name: "Shovel",
            unit: "pcs",
            unit_cost: 12.0,
            value: 240,
          },
          {
            id: "gs-2",
            code: "GS-10002",
            name: "Potting Soil",
            unit: "bag",
            unit_cost: 5.0,
            value: 200,
          },
        ],
      },
    ],
  },
];

export const mockSummaryMovementHistory = {
  total_in: {
    quantity: 1074.0,
    value: 3727.95,
  },
  total_out: {
    quantity: 908.0,
    value: 5458.25,
  },
  net_change: {
    change_quantity: 166.0,
    change_value: 1877.45,
  },
  transaction_count: 60,
};

export type InventoryBalanceTypeDto = "IN" | "OUT" | "ADJUSTMENT";

export interface InventoryBalanceItemDto {
  id: string;
  date: string; // format: 'YYYY-MM-DD'
  time: string; // format: 'HH:mm'
  ref: {
    code: string;
    no: string;
  };
  product: {
    name: string;
    code: string;
  };
  location: string;
  type: InventoryBalanceTypeDto;
  reason: string;
  quantity: {
    old: number;
    new: number;
    diff: number;
  };
  value: {
    old: number;
    new: number;
    diff: number;
  };
}

export const mockMovementHistoryList: InventoryBalanceItemDto[] = [
  {
    id: "ib-1",
    date: "2024-01-01",
    time: "10:00",
    ref: {
      code: "TRF",
      no: "39823",
    },
    product: {
      name: "Apple",
      code: "P-1001",
    },
    location: "Warehouse",
    type: "IN",
    reason: "Purchase Order",
    quantity: {
      old: 100,
      new: 150,
      diff: 50,
    },
    value: {
      old: 1000,
      new: 1500,
      diff: 500,
    },
  },
  {
    id: "ib-2",
    date: "2024-01-03",
    time: "14:45",
    ref: {
      code: "SAL",
      no: "39824",
    },
    product: {
      name: "Banana",
      code: "P-1002",
    },
    location: "Kitchen",
    type: "OUT",
    reason: "Customer Sale",
    quantity: {
      old: 150,
      new: 130,
      diff: -20,
    },
    value: {
      old: 1200,
      new: 1040,
      diff: -160,
    },
  },
  {
    id: "ib-3",
    date: "2024-01-05",
    time: "09:30",
    ref: {
      code: "ADJ",
      no: "39825",
    },
    product: {
      name: "Carrot",
      code: "P-1003",
    },
    location: "Cold Storage",
    type: "ADJUSTMENT",
    reason: "Inventory Count",
    quantity: {
      old: 80,
      new: 78,
      diff: -2,
    },
    value: {
      old: 640,
      new: 624,
      diff: -16,
    },
  },
  {
    id: "ib-4",
    date: "2024-01-06",
    time: "16:10",
    ref: {
      code: "PO",
      no: "39826",
    },
    product: {
      name: "Milk",
      code: "D-2001",
    },
    location: "Dairy Section",
    type: "IN",
    reason: "Supplier Delivery",
    quantity: {
      old: 60,
      new: 110,
      diff: 50,
    },
    value: {
      old: 660,
      new: 1210,
      diff: 550,
    },
  },
  {
    id: "ib-5",
    date: "2024-01-07",
    time: "11:05",
    ref: {
      code: "RTN",
      no: "39827",
    },
    product: {
      name: "Cheese",
      code: "D-2002",
    },
    location: "Dairy Section",
    type: "OUT",
    reason: "Product Return",
    quantity: {
      old: 30,
      new: 20,
      diff: -10,
    },
    value: {
      old: 450,
      new: 300,
      diff: -150,
    },
  },
  {
    id: "ib-6",
    date: "2024-01-08",
    time: "08:50",
    ref: {
      code: "ADJ",
      no: "39828",
    },
    product: {
      name: "Orange Juice",
      code: "JU-6101",
    },
    location: "Beverage Section",
    type: "ADJUSTMENT",
    reason: "Spillage",
    quantity: {
      old: 90,
      new: 88,
      diff: -2,
    },
    value: {
      old: 180,
      new: 176,
      diff: -4,
    },
  },
  {
    id: "ib-7",
    date: "2024-01-10",
    time: "13:20",
    ref: {
      code: "TRF",
      no: "39829",
    },
    product: {
      name: "Bread",
      code: "BK-4001",
    },
    location: "Bakery",
    type: "IN",
    reason: "Internal Transfer",
    quantity: {
      old: 200,
      new: 230,
      diff: 30,
    },
    value: {
      old: 600,
      new: 690,
      diff: 90,
    },
  },
  {
    id: "ib-8",
    date: "2024-01-12",
    time: "15:10",
    ref: {
      code: "SAL",
      no: "39830",
    },
    product: {
      name: "Coke",
      code: "SD-6001",
    },
    location: "Beverage Section",
    type: "OUT",
    reason: "Promotion Giveaway",
    quantity: {
      old: 300,
      new: 280,
      diff: -20,
    },
    value: {
      old: 300,
      new: 280,
      diff: -20,
    },
  },
  {
    id: "ib-9",
    date: "2024-01-13",
    time: "17:40",
    ref: {
      code: "ADJ",
      no: "39831",
    },
    product: {
      name: "Pen",
      code: "ST-9002",
    },
    location: "Office Supplies",
    type: "ADJUSTMENT",
    reason: "Damaged Item",
    quantity: {
      old: 50,
      new: 47,
      diff: -3,
    },
    value: {
      old: 125,
      new: 117.5,
      diff: -7.5,
    },
  },
  {
    id: "ib-10",
    date: "2024-01-15",
    time: "10:20",
    ref: {
      code: "TRF",
      no: "39832",
    },
    product: {
      name: "Potato Chips",
      code: "CH-7001",
    },
    location: "Snack Area",
    type: "IN",
    reason: "Restocking",
    quantity: {
      old: 40,
      new: 100,
      diff: 60,
    },
    value: {
      old: 60,
      new: 150,
      diff: 90,
    },
  },
  {
    id: "ib-11",
    date: "2024-01-16",
    time: "12:00",
    ref: {
      code: "SAL",
      no: "39833",
    },
    product: {
      name: "Chocolate Chip Cookies",
      code: "CO-7101",
    },
    location: "Snack Area",
    type: "OUT",
    reason: "Staff Use",
    quantity: {
      old: 75,
      new: 70,
      diff: -5,
    },
    value: {
      old: 150,
      new: 140,
      diff: -10,
    },
  },
];
