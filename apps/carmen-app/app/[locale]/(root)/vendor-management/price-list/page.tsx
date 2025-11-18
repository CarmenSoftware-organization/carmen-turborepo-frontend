import PriceListComponent from "./_components/PriceListComponent";
import { createMetadata } from "@/utils/metadata";

export const generateMetadata = createMetadata("PriceList", "title");

export default function PriceListPage() {
  return <PriceListComponent />;
}
