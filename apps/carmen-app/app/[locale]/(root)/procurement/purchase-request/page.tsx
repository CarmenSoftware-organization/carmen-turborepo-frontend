import { createMetadata } from "@/utils/metadata";
import PurchaseRequestComponent from "./_components/PurchaseRequestComponent";

export const generateMetadata = createMetadata("PurchaseRequest", "title");

export default function PurchaseRequestPage() {
  return <PurchaseRequestComponent />;
}
