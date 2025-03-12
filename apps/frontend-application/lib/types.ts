// File: types/inventory.ts

import { z } from 'zod';

import * as m from '@/paraglide/messages.js';

// Common Types and Enums

// export const DocumentStatus = () => {
//   return{
//     DRAFT : {value : 1, label : 'DRAFT'},
//     IN_PROGRESS : {value : 2, label : 'IN PROGRESS'},
//     COMPLETED : {value : 3, label : 'COMPLETED'},
//     VOID :  {value : 4, label : 'VOID'},
//   }
// }

export enum AuthFormType {
  SignIn = 1,
  SignUp = 2,
  ForgotPassword = 3,
  CreatePassword = 4,
  ResetPassword = 5,
}

export type Money = {
  amount: number;
  currency: string;
};

// Currency and Exchange Rate Types

export interface Currency {
	id: number;
	code: string;
	description: string;
	active: boolean;
	currency: string;
}

export interface ExchangeRate {
  id: number;
  currencyCode: string;
  currencyName: string;
  rate: number;
  lastUpdated: string;
}

// Inventory Types

// export interface Item {
//   itemId: number;
//   itemCode: string;
//   itemName: string;
//   description?: string;
//   categoryId: number;
//   baseUnitId: number;
//   costingMethod: CostingMethod;
//   is_active: boolean;
//   isSerialized: boolean;
//   minimumQuantity?: number;
//   maximumQuantity?: number;
//   reorderPoint?: number;
//   reorderQuantity?: number;
//   leadTime?: number;
//   lastPurchaseDate?: Date;
//   lastPurchasePrice?: number;
//   lastSaleDate?: Date;
//   lastSalePrice?: number;
// }

export enum CostingMethod {
  FIFO = "FIFO",
  MOVING_AVERAGE = "MOVING_AVERAGE",
  WEIGHTED_AVERAGE = "WEIGHTED_AVERAGE",
}

export interface InventoryTransaction {
  transactionId: number;
  itemId: number;
  locationId: number;
  transactionType: TransactionType;
  quantity: number;
  unitCost: number;
  totalCost: number;
  transactionDate: Date;
  referenceNo?: string;
  referenceType?: string;
  userId: number;
  notes?: string;
}

export enum TransactionType {
  RECEIVE = "RECEIVE",
  ISSUE = "ISSUE",
  TRANSFER = "TRANSFER",
  ADJUST = "ADJUST",
}

export enum GRNStatus {
  RECEIVED = "RECEIVED",
  COMMITTED = "COMMITTED",
  VOID = "VOID",
}

export interface GRNItem {
  grnItemId: number;
  grnRefNo: string;
  poLineId: number;
  itemId: number;
  storeLocationId: number;
  receivedQuantity: number;
  receivedUnitId: number;
  isFOC: boolean;
  price: number;
  taxAmount: number;
  totalAmount: number;
  status: GRNItemStatus;
  deliveryPoint?: string;
  basePrice: number;
  baseQuantity: number;
  extraCost: number;
  totalCost: number;
  discountAdjustment: boolean;
  discountAmount?: number;
  taxAdjustment: boolean;
  lotNumber?: string;
  expiryDate?: Date;
  comment?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  content: string;
  timestamp: Date;
}

export enum GRNItemStatus {
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export enum CostDistributionMethod {
  NET_AMOUNT = "net-amount",
  QUANTITY_RATIO = "quantity-ratio",
}

// Purchase Order (PO) Types

export interface PurchaseOrder {
  poId: string;
  number: string;
  vendorId: number;
  vendorName: string;
  orderDate: Date;
  DeliveryDate?: Date | null;
  status: PurchaseOrderStatus;
  currencyCode: string;
  exchangeRate: number;
  notes?: string;
  createdBy: number;
  approvedBy?: number;
  approvalDate?: Date;
  email: string;
  buyer: string;
  creditTerms: string;
  description: string;
  remarks: string;
  items: PurchaseOrderItem[];
  baseCurrencyCode: string;
  baseSubTotalPrice: number;
  subTotalPrice: number;
  baseNetAmount: number;
  netAmount: number;
  baseDiscAmount: number;
  discountAmount: number;
  baseTaxAmount: number;
  taxAmount: number;
  baseTotalAmount: number;
  totalAmount: number;
}

export interface PurchaseOrderItem {
  id: string;
  // code: string;
  name: string;
  description: string;
  convRate: number;
  orderedQuantity: number;
  orderUnit: string;
  baseQuantity: number;
  baseUnit: string;
  baseReceivingQty: number;
  receivedQuantity: number;
  remainingQuantity: number;
  unitPrice: number;
  status: PurchaseRequestItemStatus;
  isFOC: boolean;
  taxRate: number;
  discountRate: number;
  attachments?: Attachment[];
  baseSubTotalPrice: number;
  subTotalPrice: number;
  baseNetAmount: number;
  netAmount: number;
  baseDiscAmount: number;
  discountAmount: number;
  baseTaxAmount: number;
  taxAmount: number;
  baseTotalAmount: number;
  totalAmount: number;
  comment?: string;
  taxIncluded: boolean;
  adjustments?: {
    discount: boolean;
    tax: boolean;
  };
  lastReceiveDate?: Date;
  lastPrice?: number;
  lastVendorId?: number;
  attachedFile?: File | null;
  inventoryInfo: {
    onHand: number;
    onOrdered: number;
    reorderLevel: number;
    restockLevel: number;
    averageMonthlyUsage: number;
    lastPrice: number;
    lastOrderDate: Date;
    lastVendor: string;
  };
  received?: GRNItem[];
}

export enum PurchaseOrderStatus {
  Open = "Open",
  Voided = "Voided",
  Closed = "Closed",
  Draft = "Draft",
  Sent = "Sent",
  Partial = "Partial",
  FullyReceived = "FullyReceived",
  Cancelled = "Cancelled",
  Deleted = "Deleted",
}

export interface PurchaseOrderLine {
  poLineId: number;
  poId: number;
  itemId: number;
  orderedQuantity: number;
  orderedUnitId: number;
  unitPrice: number;
  receivedQuantity: number;
  lineStatus: POLineStatus;
  lastReceiveDate?: Date;
  lastPrice?: number;
  lastVendorId?: number;
}

export enum POLineStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export interface Attachment {
  id: string;
  description?: string;
  publicAccess: boolean;
  userId: string;
  userName: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  uploadDate: Date;
}



// Purchase Request (PR) Types

export interface PurchaseRequest_1 {
  id: string;
  refNumber: string;
  date: Date;
  type: PRType;
  deliveryDate: Date;
  description: string;
  requestorId: string;
  requestor: {
    name: string;
    id: string;
    department: string;
  };
  currency: string;
  status: DocumentStatus;
  workflowStatus: WorkflowStatus;
  currentWorkflowStage: WorkflowStage;
  location: string;
  items: PurchaseRequestItem[];
  attachments: Attachment[];
  subtotal: Money;
  tax: Money;
  jobCode: string;
  department: string;
  budgetCode: string;
  allocatedBudget: Money;
  yearToDateSpending: Money;
  exchangeRate: number;
  exchangeRateDate: Date;
  paymentMethod?: string;
  paymentTerms?: string;
  earlyPaymentDiscount?: string;
  comments: Comment[];
  approvals: WorkflowStep[];
  deliveryPoint: string;
  activityLog: ActivityLogEntry[];
  additionalCharges: Money;
  baseSubTotalPrice: number;
  subTotalPrice: number;
  baseNetAmount: number;
  netAmount: number;
  baseDiscAmount: number;
  discountAmount: number;
  baseTaxAmount: number;
  taxAmount: number;
  baseTotalAmount: number;
  totalAmount: number;
}

// export enum WorkflowStatus {
//   PENDING = "PENDING",
//   APPROVED = "APPROVED",
//   REJECTED = "REJECTED",
//   DRAFT = "DRAFT",
//   SUBMITTED = "SUBMITTED",
//   REVISION = "REVISION",
// }

// export enum WorkflowStage {
//   REQUESTER = "REQUESTER",
//   DEPARTMENT_HEAD_APPROVAL = "DEPARTMENT_HEAD_APPROVAL",
//   PURCHASE_COORDINATOR_REVIEW = "PURCHASE_COORDINATOR_REVIEW",
//   FINANCE_MANAGER_APPROVAL = "FINANCE_MANAGER_APPROVAL",
//   GENERAL_MANAGER_APPROVAL = "GENERAL_MANAGER_APPROVAL",
//   COMPLETED = "COMPLETED",
// }

export interface IBaseSummary {
  baseSubTotalPrice: number;
  subTotalPrice: number;
  baseNetAmount: number;
  netAmount: number;
  baseDiscAmount: number;
  discountAmount: number;
  baseTaxAmount: number;
  taxAmount: number;
  baseTotalAmount: number;
  totalAmount: number;
}

export interface PurchaseRequestItem {
  id?: string;
  location: string;
  name: string;
  description: string;
  unit: string;
  quantityRequested: number;
  quantityApproved: number;
  deliveryDate: Date;
  deliveryPoint: string;
  currency: string;
  currencyRate: number;
  price: number;
  foc: number;
  taxIncluded: boolean;// adjustment: boolean;
  adjustments: {
    discount?: boolean;
    tax: boolean;
  };
  discountRate: number;
  taxRate: number;
  vendor: string;
  pricelistNumber: string;
  comment: string;
  createdBy?: string;
  createdDate?: Date;
  updatedBy?: string;
  updatedDate?: Date;
  itemCategory: string;
  itemSubcategory: string;
  status: PurchaseRequestItemStatus;
  inventoryInfo: {
    onHand: number;
    onOrdered: number;
    reorderLevel: number;
    restockLevel: number;
    averageMonthlyUsage: number;
    lastPrice: number;
    lastOrderDate: Date;
    lastVendor: string;
    inventoryUnit: string;
  };
  accountCode: string;
  jobCode: string;
  baseSubTotalPrice: number;
  subTotalPrice: number;
  baseNetAmount: number;
  netAmount: number;
  baseDiscAmount: number;
  discountAmount: number;
  baseTaxAmount: number;
  taxAmount: number;
  baseTotalAmount: number;
  totalAmount: number;
}

export type PurchaseRequestItemStatus =
  "Pending" |
  "Accepted" |
  "Rejected" |
  "Review";


export interface WorkflowStep {
  stage: WorkflowStage;
  status: WorkflowStatus;
}

export interface GoodsReceiveNote {
  id: string;
  ref: string;
  date: Date;
  invoiceDate: Date;
  invoiceNumber: string;
  taxInvoiceDate?: Date;
  taxInvoiceNumber?: string;
  description: string;
  receiver: string;
  vendorId: string;
  vendor: string;
  location: string;
  currency: string;
  exchangeRate: number;
  baseCurrency: string;
  status: GoodsReceiveNoteStatus | string;
  isConsignment: boolean;
  isCash: boolean;
  cashBook?: string;
  items: GoodsReceiveNoteItem[];
  selectedItems: string[];
  stockMovements: StockMovement[];
  extraCosts: ExtraCost[];
  comments: Comment[];
  attachments: Attachment[];
  activityLog: ActivityLogEntry[];
  financialSummary?: FinancialSummary | null;
  baseSubTotalPrice: number;
  subTotalPrice: number;
  baseNetAmount: number;
  netAmount: number;
  baseDiscAmount: number;
  discountAmount: number;
  baseTaxAmount: number;
  taxAmount: number;
  baseTotalAmount: number;
  totalAmount: number;
  creditTerms?: string;
  dueDate?: Date;
}

export interface GoodsReceiveNoteItem {
  id: string;
  name: string;
  description: string;
  jobCode: string;
  orderedQuantity: number;
  receivedQuantity: number;
  unit: string;
  unitPrice: number;
  subTotalAmount: number;
  totalAmount: number;
  taxRate: number;
  taxAmount: number;
  discountRate: number;
  discountAmount: number;
  netAmount: number;
  expiryDate?: Date;
  serialNumber?: string;
  notes?: string;
  baseCurrency: string;
  baseQuantity: number;
  baseUnitPrice: number;
  baseUnit: string;
  baseSubTotalAmount: number;
  baseNetAmount: number;
  baseTotalAmount: number;
  baseTaxRate: number;
  baseTaxAmount: number;
  baseDiscountRate: number;
  baseDiscountAmount: number;
  conversionRate: number;
  currency: string;
  exchangeRate: number;
  extraCost: number;
  inventoryOnHand: number;
  inventoryOnOrder: number;
  inventoryReorderThreshold: number;
  inventoryRestockLevel: number;
  purchaseOrderRef: string;
  lastPurchasePrice: number;
  lastOrderDate: Date;
  lastVendor: string;
  lotNumber: string;
  deliveryPoint: string;
  deliveryDate: Date;
  location: string;
  isFreeOfCharge: boolean;
  taxIncluded: boolean;
  adjustments: {
    discount: boolean;
    tax: boolean;
  };
  availableLots?: {
    lotNumber: string;
    expiryDate: Date;
  }[];
}

export interface StockMovement {
  id: string;
  itemName: string;
  unit: string;
  quantity: number;
  fromLocation: string;
  toLocation: string;
  netAmount: number;
  extraCost: number;
  totalAmount: number;
  cost: number;
  totalCost: number;
  currency: string;
  itemDescription: string
  lotNumber: number
}

export interface ExtraCost {
  id: string;
  type: CostType;
  amount: number;
  currency: string;
  exchangeRate: number;
  baseAmount: number;
  baseCurrency: string;
}
export type GoodsReceiveNoteMode = "view" | "edit" | "add";

export type GoodsReceiveNoteStatus =
  | "Pending"
  | "Received"
  | "Partial"
  | "Cancelled"
  | "Voided";

export type CostType = "shipping" | "handling" | "insurance" | "other";

export interface ExtraCost {
  id: string;
  type: CostType;
  amount: number;
}

export interface FinancialSummary {
  id: string;
  netAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  baseNetAmount: number;
  baseTaxAmount: number;
  baseTotalAmount: number;
  baseCurrency: string;
  jvType: string;
  jvNumber: string;
  jvDate: Date;
  jvDescription: string;
  jvStatus: string;
  jvReference: string;
  jvDetail?: JournalEntryDetail[];
  jvTotal: JournalEntryTotal;
  sourceOfTransaction?: string
}

export interface JournalEntryDetail {
  department: Department;
  accountCode: AccountCode;
  accountName: string;
  currency: string;
  debit: number;
  credit: number;
  baseCurrency: string;
  baseDebit: number;
  baseCredit: number;
}

export interface JournalEntryTotal {
  debit: number;
  credit: number;
  baseDebit: number;
  baseCredit: number;
  baseCurrency: string;
}

export interface ActivityLogEntry {
  id: string;
  action: string;
  userId: string;
  userName: string;
  activityType: string;
  description: string;
  timestamp: Date;
}

export interface Department {
  id: string;
  name: string;
}

export interface AccountCode {
  id: string;
  code: string;
  name: string;
}

export enum PRType {
  GeneralPurchase = "GeneralPurchase",
  MarketList = "MarketList",
  AssetPurchase = "AssetPurchase",
  ServiceRequest = "ServiceRequest",
}

export enum DocumentStatus {
  Draft = "Draft",
  Submitted = "Submitted",
  InProgress = "InProgress",
  Completed = "Completed",
  Rejected = "Rejected",
}

export enum WorkflowStatus {
  pending = "Pending",
  approved = "Approved",
  rejected = "Rejected",
}

export enum WorkflowStage {
  requester = "Requester",
  departmentHeadApproval = "DepartmentHeadApproval",
  purchaseCoordinatorReview = "PurchaseCoordinatorReview",
  financeManagerApproval = "FinanceManagerApproval",
  generalManagerApproval = "GeneralManagerApproval",
  completed = "Completed",
}

export interface PurchaseRequest {
  id: string;
  refNumber: string;
  date: Date;
  vendor: string;
  vendorId: number;
  type: PRType;
  deliveryDate: Date;
  description: string;
  requestorId: string;
  requestor: {
    name: string;
    id: string;
    department: string;
  };
  status: DocumentStatus;
  workflowStatus: WorkflowStatus;
  currentWorkflowStage: WorkflowStage;
  location: string;
  department: string;
  jobCode: string;
  estimatedTotal: number;
  currency: string;
  baseCurrencyCode: string;
  baseSubTotalPrice: number;
  subTotalPrice: number;
  baseNetAmount: number;
  netAmount: number;
  baseDiscAmount: number;
  discountAmount: number;
  baseTaxAmount: number;
  taxAmount: number;
  baseTotalAmount: number;
  totalAmount: number;
}

export type WorkflowAction = "approve" | "reject" | "sendBack";

export interface ItemDetail {
  id: string;
  location: string;
  product: string;
  comment: string;
  unit: string;
  request: {
    quantity: number;
    ordering: number;
  };
  approve: {
    quantity: number;
    onHand: number;
  };
  currency: string;
  price: {
    current: number;
    last: number;
  };
  total: number;
  status: "A" | "R";
}

export interface BudgetData {
  location: string;
  budgetCategory: string;
  totalBudget: number;
  softCommitmentPR: number;
  softCommitmentPO: number;
  hardCommitment: number;
  availableBudget: number;
  currentPRAmount: number;
}

/* start */
//   export enum PRType {
//     GeneralPurchase = 'General Purchase',
//     MarketList = 'Market List',
//     AssetPurchase = 'Asset Purchase'
//   }

//   export enum DocumentStatus {
//     Draft = 'Draft',
//     Submitted = 'Submitted',
//     InProgress = 'In Progress',
//     Approved = 'Approved',
//     Rejected = 'Rejected'
//   }

//   export enum WorkflowStatus {
//     pending = 'pending',
//     approved = 'approved',
//     rejected = 'rejected'
//   }

//   export enum WorkflowStage {
//     requester = 'Requester',
//     departmentHeadApproval = 'Department Head Approval',
//     financialReview = 'Financial Review',
//     procurement = 'Procurement',
//     finalApproval = 'Final Approval'
//   }

//   export type WorkflowAction = 'approve' | 'reject' | 'sendBack'
export interface ActionState<T> {
  data: T | null;
  error: string | null;
}

export interface Requestor {
  name: string;
  id: string;
  department: string;
}

// export interface PurchaseRequestItem {
//   id: string;
//   description: string;
//   quantity: number;
//   unitPrice: Money;
//   totalPrice: Money;
// }

export interface Budget {
  totalBudget: number;
  availableBudget: number;
  allocatedBudget: number;
}

export interface ApprovalHistoryItem {
  stage: WorkflowStage;
  approver: string;
  date: Date;
  status: string;
}

export interface PurchaseRequest_3 {
  id: string;
  refNumber: string;
  date: Date;
  type: PRType;
  deliveryDate: Date;
  description: string;
  requestorId: string;
  requestor: Requestor;
  currency: string;
  vendor: string;
  vendorId: number;
  status: DocumentStatus;
  workflowStatus: WorkflowStatus;
  currentWorkflowStage: WorkflowStage;
  location: string;
  department: string;
  jobCode: string;
  estimatedTotal: number;
  items: PurchaseRequestItem[];
  attachments: Attachment[];
  comments: Comment[];
  budget: Budget;
  approvalHistory: ApprovalHistoryItem[];
  baseSubTotalPrice: number;
  subTotalPrice: number;
  baseNetAmount: number;
  netAmount: number;
  baseDiscAmount: number;
  discountAmount: number;
  baseTaxAmount: number;
  taxAmount: number;
  baseTotalAmount: number;
  totalAmount: number;
}

export interface BudgetData {
  location: string;
  budgetCategory: string;
  totalBudget: number;
  softCommitmentPR: number;
  softCommitmentPO: number;
  hardCommitment: number;
  availableBudget: number;
  currentPRAmount: number;
}

export interface ItemDetail {
  id: string;
  location: string;
  product: string;
  comment: string;
  unit: string;
  request: {
    quantity: number;
    ordering: number;
  };
  approve: {
    quantity: number;
    onHand: number;
  };
  currency: string;
  price: {
    current: number;
    last: number;
  };
  total: number;
  status: "A" | "R";
}

export enum CurrencyCode {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  JPY = "JPY",
  CNY = "CNY",
  THB = "THB",
}

export interface Product {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  id: string;
  productCode: string;
  name: string;
  description: string;
  localDescription: string;
  categoryId: string;
  subCategoryId: string;
  itemGroupId: string;
  primaryInventoryUnitId: string;
  size: string;
  color: string;
  barcode: string;
  is_active: boolean;
  basePrice: number;
  currency: string;
  taxType: string;
  taxRate: number;
  standardCost: number;
  lastCost: number;
  priceDeviationLimit: number;
  quantityDeviationLimit: number;
  minStockLevel: number;
  maxStockLevel: number;
  isForSale: boolean;
  isIngredient: boolean;
  weight: number;
  dimensions: { length: number; width: number; height: number };
  shelfLife: number;
  storageInstructions: string;
  unitConversions: UnitConversion[];
  imagesUrl: string;
}

export interface UnitConversion {
  id: string;
  unitId: string;
  fromUnit: string;
  toUnit: string;
  unitName: string;

  conversionFactor: number;
  unitType: "INVENTORY" | "ORDER" | "RECIPE" | "COUNTING";
}

export interface Vendor {
  id: string;
  companyName: string;
  businessRegistrationNumber: string;
  taxId: string;
  establishmentDate: string;
  businessTypeId: string;
  is_active: boolean;
  addresses: Address[];
  contacts: Contact[];
  rating: number;
}

export interface Address {
  id: string;
  addressType: "MAIN" | "BILLING" | "SHIPPING";
  addressLine: string;
  subDistrictId: string;
  districtId: string;
  provinceId: string;
  postalCode: string;
  isPrimary: boolean;
}

export interface Contact {
  id: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  department: string;
  isPrimary: boolean;
}

export enum Status {
  Open = "Open",
  Closed = "Closed",
  Draft = "Draft",
  Sent = "Sent",
  Committed = "Committed",
  Saved = "Saved",
  Voided = "Voided",
  Approved = "Approved",
  Rejected = "Rejected",
  Pending = "Pending",
  InProgress = "InProgress",
  Completed = "Completed",
  Cancelled = "Cancelled",
  OnHold = "OnHold",
  Delayed = "Delayed",
  Partial = "Partial",
  Submitted = "Submitted",
  Accepted = "Accepted",
  SendBack = "SendBack",
  Review = "Review",
  Deleted = "Deleted",
  Received = "Received",
}

export enum FormAction {
  CREATE = "new",
  VIEW = "",
  EDIT = "edit"
}

// Unit
export const UnitSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  description: z.string().min(1, "Description is required").max(100, "Description must be less than 100 characters"),
  is_active: z.boolean().default(true)
});

export type UnitType = z.infer<typeof UnitSchema>;
export interface UnitLabel {
  key: keyof UnitType;
  label: string;
}
export const PrSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  requestor: z.string(),
  department: z.string(),
  description: z.string(),
  date: z.preprocess((arg) => (typeof arg === "string" ? new Date(arg) : arg), z.date()),
  status: z.string(),
  amount: z.number(),
  currentStage: z.string()
});

export type PrType = z.infer<typeof PrSchema>;
export interface PrLabel {
  key: keyof PrType;
  label: string;
}

const PurchaseOrderStatusSchema = z.enum([
  "Open",
  "Voided",
  "Closed",
  "Draft",
  "Sent",
  "Partial",
  "FullyReceived",
  "Cancelled",
  "Deleted",
  "Pending"
]);

const POLineStatusSchema = z.enum(["OPEN", "CLOSED"]);

const AttachmentSchema = z.object({
  id: z.string(),
  description: z.string().optional(),
  publicAccess: z.boolean(),
  userId: z.string(),
  userName: z.string(),
  fileName: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  fileUrl: z.string().url(),
  uploadDate: z.date(),
});

const InventoryInfoSchema = z.object({
  onHand: z.number(),
  onOrdered: z.number(),
  reorderLevel: z.number(),
  restockLevel: z.number(),
  averageMonthlyUsage: z.number(),
  lastPrice: z.number(),
  lastOrderDate: z.date(),
  lastVendor: z.string(),
});

export const PurchaseOrderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  convRate: z.number(),
  orderedQuantity: z.number(),
  orderUnit: z.string(),
  baseQuantity: z.number(),
  baseUnit: z.string(),
  baseReceivingQty: z.number(),
  receivedQuantity: z.number(),
  remainingQuantity: z.number(),
  unitPrice: z.number(),
  status: PurchaseOrderStatusSchema,
  isFOC: z.boolean(),
  taxRate: z.number(),
  discountRate: z.number(),
  attachments: z.array(AttachmentSchema).optional(),
  baseSubTotalPrice: z.number(),
  subTotalPrice: z.number(),
  baseNetAmount: z.number(),
  netAmount: z.number(),
  baseDiscAmount: z.number(),
  discountAmount: z.number(),
  baseTaxAmount: z.number(),
  taxAmount: z.number(),
  baseTotalAmount: z.number(),
  totalAmount: z.number(),
  comment: z.string().optional(),
  taxIncluded: z.boolean(),
  adjustments: z.object({
    discount: z.boolean(),
    tax: z.boolean(),
  }).optional(),
  lastReceiveDate: z.date().optional(),
  lastPrice: z.number().optional(),
  lastVendorId: z.number().optional(),
  attachedFile: z.instanceof(File).nullable().optional(),
  inventoryInfo: InventoryInfoSchema,
  received: z.array(z.any()).optional(),
});

export const PurchaseOrderLineSchema = z.object({
  poLineId: z.number(),
  poId: z.number(),
  itemId: z.number(),
  orderedQuantity: z.number(),
  orderedUnitId: z.number(),
  unitPrice: z.number(),
  receivedQuantity: z.number(),
  lineStatus: POLineStatusSchema,
  lastReceiveDate: z.date().optional(),
  lastPrice: z.number().optional(),
  lastVendorId: z.number().optional(),
});

export const PurchaseOrderSchema = z.object({
  poId: z.string(),
  number: z.string(),
  vendorId: z.number(),
  vendorName: z.string(),
  orderDate: z.date(),
  deliveryDate: z.date().nullable().optional(),
  status: PurchaseOrderStatusSchema,
  currencyCode: z.string(),
  exchangeRate: z.number(),
  notes: z.string().optional(),
  createdBy: z.number(),
  approvedBy: z.number().optional(),
  approvalDate: z.date().optional(),
  email: z.string().email(),
  buyer: z.string(),
  creditTerms: z.string(),
  description: z.string(),
  remarks: z.string(),
  items: z.array(PurchaseOrderItemSchema),
  baseCurrencyCode: z.string(),
  baseSubTotalPrice: z.number(),
  subTotalPrice: z.number(),
  baseNetAmount: z.number(),
  netAmount: z.number(),
  baseDiscAmount: z.number(),
  discountAmount: z.number(),
  baseTaxAmount: z.number(),
  taxAmount: z.number(),
  baseTotalAmount: z.number(),
  totalAmount: z.number(),
});

export type PurchaseOrderType = z.infer<typeof PurchaseOrderSchema>;
export type PurchaseOrderItemType = z.infer<typeof PurchaseOrderItemSchema>;
export type PurchaseOrderLineType = z.infer<typeof PurchaseOrderLineSchema>;
export type AttachmentType = z.infer<typeof AttachmentSchema>;


const CreditNoteItemSchema = z.object({
	id: z.string(),
	description: z.string(),
	quantity: z.number(),
	unitPrice: z.number(),
	discountPercentage: z.number(),
	taxPercentage: z.number(),
});

const CreditNoteAttachmentSchema = z.object({
  id: z.number(),
  fileName: z.string(),
  fileSize: z.number(),
  uploadDate: z.date(),
  uploadedBy: z.string(),
});

export const EditedItemSchema = z.object({
  id: z.string(),
  productName: z.string(),
  productDescription: z.string(),
  location: z.string(),
  lotNo: z.string(),
  orderUnit: z.string(),
  inventoryUnit: z.string(),
  rcvQty: z.number(),
  cnQty: z.number(),
  unitPrice: z.number(),
  cnAmt: z.number(),
  costVariance: z.number(),
  discountAmount: z.number(),
  totalReceivedQty: z.number(),
  grnNumber: z.string(),
  grnDate: z.date(),
  taxRate: z.number(),
  tax: z.number(),
  total: z.number(),
  appliedLots: z.array(
    z.object({
      lotNumber: z.string(),
      receiveDate: z.date(),
      grnNumber: z.string(),
      invoiceNumber: z.string(),
    })
  ).optional(),
});

const CreditNoteStatusSchema = z.enum(['Draft', 'Pending', 'Approved', 'Rejected', 'Void']);

export const CreditNoteSchema = z.object({
  id: z.string(),
  refNumber: z.string(),
  description: z.string(),
  vendorId: z.number(),
  vendorName: z.string(),
  createdDate: z.date(),
  docNumber: z.string(),
  docDate: z.date(),
  netAmount: z.number(),
  taxAmount: z.number(),
  totalAmount: z.number(),
  currency: z.string(),
  status: CreditNoteStatusSchema,
  notes: z.string(),
  createdBy: z.string(),
  updatedDate: z.date(),
  updatedBy: z.string(),
  items: z.array(CreditNoteItemSchema),
  attachments: z.array(CreditNoteAttachmentSchema),
});

export type CreditNoteType = z.infer<typeof CreditNoteSchema>;
export type CreditNoteStatusType = z.infer<typeof CreditNoteStatusSchema>;
export type CreditNoteItemType = z.infer<typeof CreditNoteItemSchema>;
export type CreditNoteAttachmentType = z.infer<typeof CreditNoteAttachmentSchema>;
export type EditedItemType = z.infer<typeof EditedItemSchema>;

// Product

export const UnitConversionSchema = z.object({
  id: z.string(),
  unitId: z.string(),
  unitName: z.string(),
  conversionFactor: z.number(),
  type: z.string(),
  unitType: z.enum(['INVENTORY', 'ORDER', 'RECIPE', 'COUNTING']),
  fromUnit: z.string(),
  toUnit: z.string(),
});

export type IUnitConversion = z.infer<typeof UnitConversionSchema>;

export const ProductSchema = z.object({
  id: z.string(),
  productCode: z.string(),
  name: z.string(),
  description: z.string(),
  localDescription: z.string(),
  categoryId: z.string(),
  subCategoryId: z.string(),
  itemGroupId: z.string(),
  primaryInventoryUnitId: z.string(),
  size: z.string(),
  color: z.string(),
  barcode: z.string(),
  is_active: z.boolean(),
  basePrice: z.number(),
  currency: z.string(),
  taxType: z.string(),
  taxRate: z.number(),
  standardCost: z.number(),
  lastCost: z.number(),
  priceDeviationLimit: z.number(),
  quantityDeviationLimit: z.number(),
  minStockLevel: z.number(),
  maxStockLevel: z.number(),
  isForSale: z.boolean(),
  isIngredient: z.boolean(),
  weight: z.number(),
  dimensions: z.object({
    length: z.number(),
    width: z.number(),
    height: z.number(),
  }),
  shelfLife: z.number(),
  storageInstructions: z.string(),
  imageUrl: z.string(),
  preferVendor: z.string(),
  unitConversions: z.array(UnitConversionSchema),
  itemGroup: z.string().optional(),
});

export type IProductType = z.infer<typeof ProductSchema>;

export const ProductListSchema = z.object({
  total: z.number(),
  data: z.array(ProductSchema),
});

export type IProductList = z.infer<typeof ProductListSchema>;

export type PaginationType = {
  page?: number | 0;
  pages?: number | 0;
  perpage?: number | 10;
  total?: number | 0;
}

export interface SignInResponse {
	id: string;
	username: string;
	refresh_token: string;
	access_token: string;
	message?: string;
	tenant: {
		id: string;
		name: string;
	}[];
}

export const SignInSchema = z.object({
	username: z.string().min(2, {
		message: `${m.username_zod_error()}`,
	}),
	password: z.string().min(6, {
		message: `${m.password_zod_error()}`,
	}),
});

export type SignInType = z.infer<typeof SignInSchema>;

export interface User {
	id: string;
	username: string;
}

// export interface AuthContextType extends AuthState {
//   isAuthenticated: boolean;
//   accessToken: string | null;
//   handleLogin: (data: AuthState, token: string) => void;
//   handleLogout: () => void;
//   updateAccessToken: (token: string) => void;
//   authState: AuthState;
//   isLoading: boolean;
//   authenticatedRequest: <T>(
//     url: string,
//     options?: AuthenticatedRequestOptions
//   ) => Promise<T>;
// }

export interface AuthContextType extends AuthState {
	isAuthenticated: boolean;
	accessToken: string | null;
	handleLogin: (data: AuthState, token: string) => void;
	handleLogout: () => void;
	updateAccessToken: (token: string) => void;
	authState: AuthState;
	setAccessToken: (token: string) => void;
}

export interface AuthState {
	user: {
		id: string;
		username: string;
	} | null;
	refresh_token: string;
	access_token?: string;
	tenant: {
		id: string;
		name: string;
		is_default: boolean;
	}[];
}
export interface AuthenticatedRequestOptions extends RequestInit {
  skipAuthRefresh?: boolean;
  requireAuth?: boolean;
}


export const VerifySchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Confirm password must be at least 6 characters." }),
  consent: z.boolean(),
  emailToken: z.string(),
  userInfo: z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
    middleName: z.string().optional(),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  }),
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "The passwords did not match",
      path: ["confirmPassword"],
    });
  }
});

export type VerifyType = z.infer<typeof VerifySchema>;
export type PayloadVerifyType = Omit<VerifyType, 'confirmPassword'>;

export const RecoverPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Confirm password must be at least 6 characters." }),
  emailToken: z.string(),
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "The passwords did not match",
      path: ["confirmPassword"],
    });
  }
});

export type RecoverPasswordType = z.infer<typeof RecoverPasswordSchema>;
export type PayloadRecoverPasswordType = Omit<RecoverPasswordType, 'confirmPassword'>;

export const EmailSchema = z.object({
  email: z.string().email()
});

export type EmailType = z.infer<typeof EmailSchema>;

export type SubMenuItem = {
  name: string;
  path: string;
  icon?: string;
  description?: string;
  subItems?: SubMenuItem[];
  visible?: boolean;
  enabled?: boolean;
};

export type MenuItem = {
  title: string;
  icon: string;
  path?: string;
  visible?: boolean;
  enabled?: boolean;
  subItems?: SubMenuItem[];
};