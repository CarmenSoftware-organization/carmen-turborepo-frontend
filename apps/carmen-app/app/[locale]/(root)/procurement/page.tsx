import { createMetadata } from "@/utils/metadata";
import ProcurementPage from "./ProcurementPage";

export const generateMetadata = createMetadata("Modules", "procurement");

export default function Procurement() {
  return <ProcurementPage />;
}
