import PurchaseOrderComponent from "./_components/PurchaseOrderComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Purchase Order",
};
export default function PurchaseOrderPage() {
    return <PurchaseOrderComponent />;
} 