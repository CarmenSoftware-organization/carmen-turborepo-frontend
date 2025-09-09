import { Metadata } from "next";
import ProductComponent from "./components/ProductComponent";

export const metadata: Metadata = {
    title: "Product",
};

export default function Product() {
    return <ProductComponent />
}
