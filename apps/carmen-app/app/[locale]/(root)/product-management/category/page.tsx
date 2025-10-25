import CategoryComponent from "./_components/CategoryComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Category",
};

export default function CategoryPage() {
    return <CategoryComponent />
}
