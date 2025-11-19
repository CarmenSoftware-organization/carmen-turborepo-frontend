import ProductComponent from "./_components/ProductComponent";
import { createMetadata } from "@/utils/metadata";

export const generateMetadata = createMetadata("Products", "title");

export default function Product() {
  return <ProductComponent />;
}
