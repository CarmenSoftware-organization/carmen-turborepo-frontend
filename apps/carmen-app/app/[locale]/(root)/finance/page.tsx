import { createMetadata } from "@/utils/metadata";
import FinanceComponentPage from "./FinanceComponentPage";

export const generateMetadata = createMetadata("Modules", "finance");

export default function FinancePage() {
  return <FinanceComponentPage />;
}
