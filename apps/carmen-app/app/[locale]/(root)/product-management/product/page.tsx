import { Metadata } from "next";
import ProductComponent from "./_components/ProductComponent";

export const metadata: Metadata = {
    title: "Product",
};

export default function Product() {
    return <ProductComponent />
}
