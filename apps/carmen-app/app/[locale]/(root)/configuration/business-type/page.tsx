import BusinessTypeComponent from "./_components/BusinessTypeComponent";
import { createMetadata } from "@/utils/metadata";

export const generateMetadata = createMetadata("BusinessType", "title");

export default function BusinessTypePage() {
  return <BusinessTypeComponent />;
}
