import { VendorPortalDto } from "../_dto/vendor-portal.dto";

export const mockVendorPortal: VendorPortalDto = {
  id: "vp-001",
  vendorId: "vendor-001",
  vendorName: "ABC Industrial Supplies",
  currency: {
    id: "currency-001",
    code: "USD",
  },
  status: "draft",
  items: [
    {
      id: "vp-001",
      code: "VP001",
      description: "Stainless Steel Bolt M10x50mm",
      unit: {
        id: "unit-001",
        name: "Piece",
      },
      price: 15,
      leadTimeInDays: 7,
      moqTiers: [
        {
          id: "tier-001",
          minimumQuantity: 100,
          price: 12,
          leadTimeInDays: 5,
        },
        {
          id: "tier-002",
          minimumQuantity: 500,
          price: 10,
          leadTimeInDays: 10,
        },
      ],
    },
    {
      id: "vp-002",
      code: "VP002",
      description: "Industrial Bearing 6205-2RS",
      unit: {
        id: "unit-002",
        name: "Piece",
      },
      price: 250,
      leadTimeInDays: 14,
      moqTiers: [
        {
          id: "tier-003",
          minimumQuantity: 10,
          price: 220,
          leadTimeInDays: 14,
        },
        {
          id: "tier-004",
          minimumQuantity: 50,
          price: 200,
          leadTimeInDays: 21,
        },
      ],
    },
    {
      id: "vp-003",
      code: "VP003",
      description: "Hydraulic Hose 1/2 inch - 10m",
      unit: {
        id: "unit-003",
        name: "Meter",
      },
      price: 180,
      leadTimeInDays: 5,
      moqTiers: [
        {
          id: "tier-005",
          minimumQuantity: 50,
          price: 165,
          leadTimeInDays: 7,
        },
        {
          id: "tier-006",
          minimumQuantity: 200,
          price: 150,
          leadTimeInDays: 14,
        },
      ],
    },
    {
      id: "vp-004",
      code: "VP004",
      description: "Electric Motor 3HP 380V",
      unit: {
        id: "unit-004",
        name: "Unit",
      },
      price: 8500,
      leadTimeInDays: 30,
      moqTiers: [
        {
          id: "tier-007",
          minimumQuantity: 5,
          price: 8200,
          leadTimeInDays: 30,
        },
        {
          id: "tier-008",
          minimumQuantity: 10,
          price: 7800,
          leadTimeInDays: 45,
        },
      ],
    },
    {
      id: "vp-005",
      code: "VP005",
      description: "Safety Gloves - Nitrile Coated",
      unit: {
        id: "unit-005",
        name: "Pair",
      },
      price: 45,
      leadTimeInDays: 3,
      moqTiers: [
        {
          id: "tier-009",
          minimumQuantity: 50,
          price: 40,
          leadTimeInDays: 3,
        },
        {
          id: "tier-010",
          minimumQuantity: 200,
          price: 35,
          leadTimeInDays: 7,
        },
      ],
    },
    {
      id: "vp-006",
      code: "VP006",
      description: "PVC Pipe 4 inch Schedule 40",
      unit: {
        id: "unit-006",
        name: "Meter",
      },
      price: 125,
      leadTimeInDays: 7,
      moqTiers: [
        {
          id: "tier-011",
          minimumQuantity: 100,
          price: 115,
          leadTimeInDays: 10,
        },
        {
          id: "tier-012",
          minimumQuantity: 500,
          price: 105,
          leadTimeInDays: 14,
        },
      ],
    },
  ],
};
