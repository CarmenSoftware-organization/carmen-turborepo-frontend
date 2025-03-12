import { CreditNoteType } from "../types";

export const sampleCreditNoteData: CreditNoteType[] = [
  {
    id: "1",
    refNumber: "CN0001",
    description: "Credit Note 1",
    vendorId: 1,
    vendorName: "Supplier A",
    createdDate: new Date("2023-07-01T00:00:00Z"),
    docNumber: "INV1001",
    docDate: new Date("2023-06-15T00:00:00Z"),
    netAmount: 1000,
    taxAmount: 100,
    totalAmount: 1100,
    currency: "USD",
    status: "Approved",
    notes: "Additional notes for credit note 1",
    createdBy: "user1@example.com",
    updatedDate: new Date("2023-07-01T12:00:00Z"),
    updatedBy: "user1@example.com",
    items: [
      {
        id: "001",
        description: "Item 1 for CN0001",
        quantity: 5,
        unitPrice: 200,
        discountPercentage: 0,
        taxPercentage: 10,
      }
    ],
    attachments: [
      {
        id: 1,
        fileName: "attachment1_cn1.pdf",
        fileSize: 500000,
        uploadDate: new Date("2023-07-01T12:00:00Z"),
        uploadedBy: "user1@example.com",
      }
    ]
  },
  {
    id: "2",
    refNumber: "CN0002",
    description: "Credit Note 2",
    vendorId: 2,
    vendorName: "Supplier B",
    createdDate: new Date("2023-07-02T00:00:00Z"),
    docNumber: "INV1002",
    docDate: new Date("2023-06-16T00:00:00Z"),
    netAmount: 2000,
    taxAmount: 200,
    totalAmount: 2200,
    currency: "EUR",
    status: "Pending",
    notes: "Additional notes for credit note 2",
    createdBy: "user2@example.com",
    updatedDate: new Date("2023-07-02T12:00:00Z"),
    updatedBy: "user2@example.com",
    items: [
      {
        id: "002",
        description: "Item 1 for CN0002",
        quantity: 10,
        unitPrice: 200,
        discountPercentage: 5,
        taxPercentage: 10,
      }
    ],
    attachments: [
      {
        id: 2,
        fileName: "attachment1_cn2.pdf",
        fileSize: 550000,
        uploadDate: new Date("2023-07-02T12:00:00Z"),
        uploadedBy: "user2@example.com",
      }
    ]
  },
  {
    id: "3",
    refNumber: "CN0003",
    description: "Credit Note 3",
    vendorId: 3,
    vendorName: "Supplier C",
    createdDate: new Date("2023-07-03T00:00:00Z"),
    docNumber: "INV1003",
    docDate: new Date("2023-06-17T00:00:00Z"),
    netAmount: 1500,
    taxAmount: 150,
    totalAmount: 1650,
    currency: "GBP",
    status: "Approved",
    notes: "Additional notes for credit note 3",
    createdBy: "user3@example.com",
    updatedDate: new Date("2023-07-03T12:00:00Z"),
    updatedBy: "user3@example.com",
    items: [
      {
        id: "003",
        description: "Item 1 for CN0003",
        quantity: 3,
        unitPrice: 500,
        discountPercentage: 0,
        taxPercentage: 10,
      }
    ],
    attachments: [
      {
        id: 3,
        fileName: "attachment1_cn3.pdf",
        fileSize: 600000,
        uploadDate: new Date("2023-07-03T12:00:00Z"),
        uploadedBy: "user3@example.com",
      }
    ]
  },
  {
    id: "4",
    refNumber: "CN0004",
    description: "Credit Note 4",
    vendorId: 4,
    vendorName: "Supplier D",
    createdDate: new Date("2023-07-04T00:00:00Z"),
    docNumber: "INV1004",
    docDate: new Date("2023-06-18T00:00:00Z"),
    netAmount: 500,
    taxAmount: 50,
    totalAmount: 550,
    currency: "CAD",
    status: "Rejected",
    notes: "Additional notes for credit note 4",
    createdBy: "user4@example.com",
    updatedDate: new Date("2023-07-04T12:00:00Z"),
    updatedBy: "user4@example.com",
    items: [
      {
        id: "004",
        description: "Item 1 for CN0004",
        quantity: 2,
        unitPrice: 250,
        discountPercentage: 0,
        taxPercentage: 10,
      }
    ],
    attachments: [
      {
        id: 4,
        fileName: "attachment1_cn4.pdf",
        fileSize: 450000,
        uploadDate: new Date("2023-07-04T12:00:00Z"),
        uploadedBy: "user4@example.com",
      }
    ]
  },
  {
    id: "5",
    refNumber: "CN0005",
    description: "Credit Note 5",
    vendorId: 5,
    vendorName: "Supplier E",
    createdDate: new Date("2023-07-05T00:00:00Z"),
    docNumber: "INV1005",
    docDate: new Date("2023-06-19T00:00:00Z"),
    netAmount: 3000,
    taxAmount: 300,
    totalAmount: 3300,
    currency: "AUD",
    status: "Approved",
    notes: "Additional notes for credit note 5",
    createdBy: "user5@example.com",
    updatedDate: new Date("2023-07-05T12:00:00Z"),
    updatedBy: "user5@example.com",
    items: [
      {
        id: "005",
        description: "Item 1 for CN0005",
        quantity: 6,
        unitPrice: 500,
        discountPercentage: 0,
        taxPercentage: 10,
      }
    ],
    attachments: [
      {
        id: 5,
        fileName: "attachment1_cn5.pdf",
        fileSize: 750000,
        uploadDate: new Date("2023-07-05T12:00:00Z"),
        uploadedBy: "user5@example.com",
      }
    ]
  }
];

