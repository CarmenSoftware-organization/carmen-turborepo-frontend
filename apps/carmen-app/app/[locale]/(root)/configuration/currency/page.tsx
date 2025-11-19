import { createMetadata } from "@/utils/metadata";
import CurrencyComponent from "./_components/CurrencyComponent";

export const generateMetadata = createMetadata("Currency", "title");

export default async function CurrencyPage() {
  return <CurrencyComponent />;
}
