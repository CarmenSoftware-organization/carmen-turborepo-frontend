import { createMetadata } from "@/utils/metadata";
import DeliveryPointComponent from "./_components/DeliveryPointComponent";

export const generateMetadata = createMetadata("DeliveryPoint", "title");

export default function DeliveryPointPage() {
  return <DeliveryPointComponent />;
}
