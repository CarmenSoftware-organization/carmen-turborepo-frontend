import { createMetadata } from "@/utils/metadata";
import ProductManagePage from "./ProductManagePage";

export const generateMetadata = createMetadata("Products", "title");

export default function ProductManagement() {
  return <ProductManagePage />;
}
