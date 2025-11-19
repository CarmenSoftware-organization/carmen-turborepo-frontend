import { createMetadata } from "@/utils/metadata";
import CategoryComponent from "./_components/CategoryComponent";

export const generateMetadata = createMetadata("Category", "title");

export default function CategoryPage() {
  return <CategoryComponent />;
}
