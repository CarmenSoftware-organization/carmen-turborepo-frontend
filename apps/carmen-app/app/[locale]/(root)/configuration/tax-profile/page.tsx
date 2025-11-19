import { createMetadata } from "@/utils/metadata";
import { TaxProfileComponent } from "./_components/TaxProfileComponent";

export const generateMetadata = createMetadata("TaxProfile", "title");

export default function TaxProfile() {
  return <TaxProfileComponent />;
}
