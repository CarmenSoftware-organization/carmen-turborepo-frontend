import { createMetadata } from "@/utils/metadata";
import CreditTermComponent from "./_components/CreditTermComponent";

export const generateMetadata = createMetadata("CreditTerm", "title");

export default function CreditTermPage() {
  return <CreditTermComponent />;
}
