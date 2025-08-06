import { Metadata } from "next";
import ProductManagePage from "./ProductManagePage";

export const metadata: Metadata = {
    title: "Product Management",
};

export default function ProductManagement() {
    return <ProductManagePage />
}
