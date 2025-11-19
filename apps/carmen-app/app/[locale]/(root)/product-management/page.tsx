import { createMetadata } from "@/utils/metadata";
import ProductManagePage from "./ProductManagePage";

export const generateMetadata = createMetadata("Modules", "productManagement");

export default function ProductManagement() {
  return <ProductManagePage />;
}
