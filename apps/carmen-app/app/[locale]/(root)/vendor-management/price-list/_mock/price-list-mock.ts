import type { PriceListDtoList, PriceListDetailDto } from "../_dto/price-list-dto";

export const mockPriceListList: PriceListDtoList[] = [
  {
    id: "pl-001",
    no: "PL-2024-001",
    vendor: {
      id: "v-001",
      name: "Global Supplies Co., Ltd.",
    },
    rfp: {
      id: "rfp-001",
      name: "RFP-2024-Q1-Office Supplies",
    },
    description: "Office supplies and stationery items for Q1 2024",
    status: "active",
    itemsCount: 45,
    currency: {
      id: "cur-thb",
      code: "THB",
    },
    isActive: true,
    effectivePeriod: { from: "2024-01-01", to: "2024-03-31" },
    lastUpdate: "2024-01-15T10:30:00Z",
  },
  {
    id: "pl-002",
    no: "PL-2024-002",
    vendor: {
      id: "v-002",
      name: "TechPro Electronics Ltd.",
    },
    rfp: {
      id: "rfp-002",
      name: "RFP-2024-IT Equipment",
    },
    description: "IT equipment and accessories procurement",
    status: "active",
    itemsCount: 128,
    currency: {
      id: "cur-usd",
      code: "USD",
    },
    isActive: true,
    effectivePeriod: { from: "2024-02-01", to: "2024-07-31" },
    lastUpdate: "2024-02-10T14:20:00Z",
  },
  {
    id: "pl-003",
    no: "PL-2024-003",
    vendor: {
      id: "v-003",
      name: "Industrial Parts & Materials",
    },
    status: "draft",
    itemsCount: 67,
    currency: {
      id: "cur-thb",
      code: "THB",
    },
    isActive: false,
    effectivePeriod: { from: "2024-03-01", to: "2024-08-31" },
    lastUpdate: "2024-02-28T09:15:00Z",
  },
  {
    id: "pl-004",
    no: "PL-2024-004",
    vendor: {
      id: "v-004",
      name: "Medical Supplies International",
    },
    rfp: {
      id: "rfp-003",
      name: "RFP-2024-Medical Equipment",
    },
    description: "Medical equipment and consumables",
    status: "submit",
    itemsCount: 210,
    currency: {
      id: "cur-usd",
      code: "USD",
    },
    isActive: false,
    effectivePeriod: { from: "2024-04-01", to: "2024-09-30" },
    lastUpdate: "2024-03-05T11:45:00Z",
  },
  {
    id: "pl-005",
    no: "PL-2023-089",
    vendor: {
      id: "v-005",
      name: "Packaging Solutions Ltd.",
    },
    description: "Packaging materials and shipping supplies",
    status: "inactive",
    itemsCount: 38,
    currency: {
      id: "cur-thb",
      code: "THB",
    },
    isActive: false,
    effectivePeriod: { from: "2023-10-01", to: "2023-12-31" },
    lastUpdate: "2023-12-31T23:59:00Z",
  },
];

export const mockPriceListDetails: PriceListDetailDto[] = [
  {
    id: "pl-001",
    no: "PL-2024-001",
    vendor: {
      id: "v-001",
      name: "Global Supplies Co., Ltd.",
    },
    rfp: {
      id: "rfp-001",
      name: "RFP-2024-Q1-Office Supplies",
    },
    description: "Office supplies and stationery items for Q1 2024",
    status: "active",
    itemsCount: 45,
    currency: {
      id: "cur-thb",
      code: "THB",
    },
    isActive: true,
    effectivePeriod: { from: "2024-01-01", to: "2024-03-31" },
    lastUpdate: "2024-01-15T10:30:00Z",
    products: [
      {
        id: "prod-001",
        code: "A4-PAPER-80G",
        name: "A4 Paper 80gsm (500 sheets/ream)",
        moqs: [
          {
            minQuantity: 1,
            unit: "ream",
            price: 85,
            leadTimeDays: 3,
          },
          {
            minQuantity: 50,
            unit: "ream",
            price: 80,
            leadTimeDays: 3,
          },
          {
            minQuantity: 100,
            unit: "ream",
            price: 75,
            leadTimeDays: 5,
          },
        ],
        taxRate: 0.07,
        totalAmount: 90.95,
        priceChange: 2.5,
        lastUpdate: "2024-01-15T10:30:00Z",
      },
      {
        id: "prod-002",
        code: "PEN-BLU-001",
        name: "Blue Ballpoint Pen (Pack of 12)",
        moqs: [
          {
            minQuantity: 1,
            unit: "pack",
            price: 48,
            leadTimeDays: 2,
          },
          {
            minQuantity: 20,
            unit: "pack",
            price: 45,
            leadTimeDays: 2,
          },
        ],
        taxRate: 0.07,
        totalAmount: 51.36,
        priceChange: -1.2,
        lastUpdate: "2024-01-15T10:30:00Z",
      },
      {
        id: "prod-003",
        code: "FOLDER-A4",
        name: "A4 Manila Folder",
        moqs: [
          {
            minQuantity: 10,
            unit: "piece",
            price: 8.5,
            leadTimeDays: 1,
          },
          {
            minQuantity: 100,
            unit: "piece",
            price: 7.8,
            leadTimeDays: 3,
          },
        ],
        taxRate: 0.07,
        totalAmount: 9.095,
        priceChange: 0,
        lastUpdate: "2024-01-15T10:30:00Z",
      },
    ],
  },
  {
    id: "pl-002",
    no: "PL-2024-002",
    vendor: {
      id: "v-002",
      name: "TechPro Electronics Ltd.",
    },
    rfp: {
      id: "rfp-002",
      name: "RFP-2024-IT Equipment",
    },
    description: "IT equipment and accessories procurement",
    status: "active",
    itemsCount: 128,
    currency: {
      id: "cur-usd",
      code: "USD",
    },
    isActive: true,
    effectivePeriod: { from: "2024-02-01", to: "2024-07-31" },
    lastUpdate: "2024-02-10T14:20:00Z",
    products: [
      {
        id: "prod-101",
        code: "LAPTOP-DEL-001",
        name: "Dell Latitude 5540 - i5/16GB/512GB SSD",
        moqs: [
          {
            minQuantity: 1,
            unit: "unit",
            price: 899.99,
            leadTimeDays: 14,
          },
          {
            minQuantity: 10,
            unit: "unit",
            price: 859.99,
            leadTimeDays: 14,
          },
          {
            minQuantity: 50,
            unit: "unit",
            price: 829.99,
            leadTimeDays: 21,
          },
        ],
        taxRate: 0.07,
        totalAmount: 962.99,
        priceChange: 5.3,
        lastUpdate: "2024-02-10T14:20:00Z",
      },
      {
        id: "prod-102",
        code: "MOUSE-LOG-MX",
        name: "Logitech MX Master 3S Wireless Mouse",
        moqs: [
          {
            minQuantity: 1,
            unit: "unit",
            price: 99.99,
            leadTimeDays: 7,
          },
          {
            minQuantity: 20,
            unit: "unit",
            price: 92.99,
            leadTimeDays: 7,
          },
        ],
        taxRate: 0.07,
        totalAmount: 106.99,
        priceChange: -3.5,
        lastUpdate: "2024-02-10T14:20:00Z",
      },
      {
        id: "prod-103",
        code: "MON-DELL-27",
        name: "Dell 27\" 4K UHD Monitor (P2723DE)",
        moqs: [
          {
            minQuantity: 1,
            unit: "unit",
            price: 449.99,
            leadTimeDays: 10,
          },
          {
            minQuantity: 5,
            unit: "unit",
            price: 429.99,
            leadTimeDays: 10,
          },
          {
            minQuantity: 20,
            unit: "unit",
            price: 409.99,
            leadTimeDays: 14,
          },
        ],
        taxRate: 0.07,
        totalAmount: 481.49,
        priceChange: 1.8,
        lastUpdate: "2024-02-10T14:20:00Z",
      },
    ],
  },
  {
    id: "pl-003",
    no: "PL-2024-003",
    vendor: {
      id: "v-003",
      name: "Industrial Parts & Materials",
    },
    status: "draft",
    itemsCount: 67,
    currency: {
      id: "cur-thb",
      code: "THB",
    },
    isActive: false,
    effectivePeriod: { from: "2024-03-01", to: "2024-08-31" },
    lastUpdate: "2024-02-28T09:15:00Z",
    products: [
      {
        id: "prod-201",
        code: "BOLT-M10-50",
        name: "Hex Bolt M10x50mm - Stainless Steel",
        moqs: [
          {
            minQuantity: 100,
            unit: "piece",
            price: 3.5,
            leadTimeDays: 5,
          },
          {
            minQuantity: 1000,
            unit: "piece",
            price: 3.2,
            leadTimeDays: 7,
          },
        ],
        taxRate: 0.07,
        totalAmount: 3.745,
        priceChange: 0,
        lastUpdate: "2024-02-28T09:15:00Z",
      },
      {
        id: "prod-202",
        code: "WASHER-M10",
        name: "Flat Washer M10 - Zinc Plated",
        moqs: [
          {
            minQuantity: 100,
            unit: "piece",
            price: 0.8,
            leadTimeDays: 3,
          },
          {
            minQuantity: 1000,
            unit: "piece",
            price: 0.7,
            leadTimeDays: 5,
          },
        ],
        taxRate: 0.07,
        totalAmount: 0.856,
        priceChange: -5,
        lastUpdate: "2024-02-28T09:15:00Z",
      },
    ],
  },
  {
    id: "pl-004",
    no: "PL-2024-004",
    vendor: {
      id: "v-004",
      name: "Medical Supplies International",
    },
    rfp: {
      id: "rfp-003",
      name: "RFP-2024-Medical Equipment",
    },
    description: "Medical equipment and consumables",
    status: "submit",
    itemsCount: 210,
    currency: {
      id: "cur-usd",
      code: "USD",
    },
    isActive: false,
    effectivePeriod: { from: "2024-04-01", to: "2024-09-30" },
    lastUpdate: "2024-03-05T11:45:00Z",
    products: [
      {
        id: "prod-301",
        code: "GLOVE-NITRILE-M",
        name: "Nitrile Examination Gloves - Medium (Box of 100)",
        moqs: [
          {
            minQuantity: 1,
            unit: "box",
            price: 12.99,
            leadTimeDays: 7,
          },
          {
            minQuantity: 50,
            unit: "box",
            price: 11.99,
            leadTimeDays: 7,
          },
          {
            minQuantity: 200,
            unit: "box",
            price: 10.99,
            leadTimeDays: 14,
          },
        ],
        taxRate: 0.07,
        totalAmount: 13.9,
        priceChange: 8.2,
        lastUpdate: "2024-03-05T11:45:00Z",
      },
      {
        id: "prod-302",
        code: "MASK-SURGICAL",
        name: "3-Ply Surgical Face Mask (Box of 50)",
        moqs: [
          {
            minQuantity: 1,
            unit: "box",
            price: 8.99,
            leadTimeDays: 5,
          },
          {
            minQuantity: 100,
            unit: "box",
            price: 7.99,
            leadTimeDays: 7,
          },
        ],
        taxRate: 0.07,
        totalAmount: 9.62,
        priceChange: 12.5,
        lastUpdate: "2024-03-05T11:45:00Z",
      },
    ],
  },
  {
    id: "pl-005",
    no: "PL-2023-089",
    vendor: {
      id: "v-005",
      name: "Packaging Solutions Ltd.",
    },
    description: "Packaging materials and shipping supplies",
    status: "inactive",
    itemsCount: 38,
    currency: {
      id: "cur-thb",
      code: "THB",
    },
    isActive: false,
    effectivePeriod: { from: "2023-10-01", to: "2023-12-31" },
    lastUpdate: "2023-12-31T23:59:00Z",
    products: [
      {
        id: "prod-401",
        code: "BOX-CORR-L",
        name: "Corrugated Box Large (40x30x30 cm)",
        moqs: [
          {
            minQuantity: 50,
            unit: "piece",
            price: 18.5,
            leadTimeDays: 5,
          },
          {
            minQuantity: 200,
            unit: "piece",
            price: 16.8,
            leadTimeDays: 7,
          },
        ],
        taxRate: 0.07,
        totalAmount: 19.795,
        priceChange: 0,
        lastUpdate: "2023-12-31T23:59:00Z",
      },
      {
        id: "prod-402",
        code: "TAPE-PACK-48",
        name: "Packaging Tape 48mm x 100m - Brown",
        moqs: [
          {
            minQuantity: 12,
            unit: "roll",
            price: 35,
            leadTimeDays: 3,
          },
          {
            minQuantity: 60,
            unit: "roll",
            price: 32.5,
            leadTimeDays: 5,
          },
        ],
        taxRate: 0.07,
        totalAmount: 37.45,
        priceChange: -2.8,
        lastUpdate: "2023-12-31T23:59:00Z",
      },
    ],
  },
];

export const getMockPriceListById = (id: string): PriceListDetailDto | undefined => {
  return mockPriceListDetails.find((item) => item.id === id);
};
