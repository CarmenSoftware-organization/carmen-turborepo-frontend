// export interface IProduct {
//   id: string;
//   productCode: string;
//   name: string;
//   categoryId: string;
//   subCategoryId: string;
//   basePrice: number;
//   currency: string;
//   isActive: boolean;
//   primaryInventoryUnitId: string;
// }

import { IUnitConversion } from "./unitconversion";

export interface IProduct {
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
  isActive: boolean;
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
  imageUrl: string;
  preferVendor: string;
  unitConversions: IUnitConversion[];
}

export interface IProductList {
  total: number;
  data: IProduct[];
}