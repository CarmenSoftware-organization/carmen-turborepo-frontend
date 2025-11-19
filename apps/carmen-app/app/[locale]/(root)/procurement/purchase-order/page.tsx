import { createMetadata } from "@/utils/metadata";
import PurchaseOrderComponent from "./_components/PurchaseOrderComponent";

export const generateMetadata = createMetadata("PurchaseOrder", "title");

export default function PurchaseOrderPage() {
  return <PurchaseOrderComponent />;
}
