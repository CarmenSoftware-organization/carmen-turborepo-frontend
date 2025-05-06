import InventoryAdjustmentComponent from "./components/InventoryAdjustmentComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Inventory Adjustment",
};

export default function InventoryAdjustmentPage() {
    return <InventoryAdjustmentComponent />
}
