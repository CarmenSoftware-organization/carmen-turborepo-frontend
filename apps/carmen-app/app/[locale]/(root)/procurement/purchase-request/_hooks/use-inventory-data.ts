import { PurchaseRequestDetail } from "@/dtos/purchase-request.dto";
import { useOnHandOrder } from "@/hooks/useOnHandOrder";
import { useMemo } from "react";

export interface InventoryData {
  on_hand_qty: number;
  on_order_qty: number;
  re_order_qty: number;
  re_stock_qty: number;
}

interface UseInventoryDataParams {
  item: PurchaseRequestDetail;
  token: string;
  buCode: string;
}

interface UseInventoryDataResult {
  inventoryData: InventoryData;
  stockLevel: number;
  isLoading: boolean;
  error: Error | null;
}

export function useInventoryData({
  item,
  token,
  buCode,
}: UseInventoryDataParams): UseInventoryDataResult {
  const locationId = item.location_id || "";
  const productId = item.product_id || "";

  const { data: onHandData, isLoading, error } = useOnHandOrder(
    token,
    buCode,
    locationId,
    productId
  );

  const inventoryData = useMemo((): InventoryData => {
    if (locationId && productId && onHandData) {
      return {
        on_hand_qty: onHandData.on_hand_qty || 0,
        on_order_qty: onHandData.on_order_qty || 0,
        re_order_qty: onHandData.re_order_qty || 0,
        re_stock_qty: onHandData.re_stock_qty || 0,
      };
    }

    // Fallback to item data if API data is not available
    return {
      on_hand_qty: item.on_hand_qty || 0,
      on_order_qty: item.on_order_qty || 0,
      re_order_qty: item.re_order_qty || 0,
      re_stock_qty: item.re_stock_qty || 0,
    };
  }, [locationId, productId, onHandData, item]);

  const stockLevel = useMemo((): number => {
    const { on_hand_qty, on_order_qty, re_order_qty, re_stock_qty } = inventoryData;
    const totalQty = on_hand_qty + on_order_qty + re_order_qty + re_stock_qty;

    if (totalQty <= 0) return 0;

    const level = (on_hand_qty / totalQty) * 100;
    return Number(level.toFixed(2));
  }, [inventoryData]);

  return {
    inventoryData,
    stockLevel,
    isLoading,
    error: error as Error | null,
  };
}
