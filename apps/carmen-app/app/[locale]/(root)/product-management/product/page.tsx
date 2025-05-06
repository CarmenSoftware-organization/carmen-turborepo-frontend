import { ProductComponent } from "./components/ProductComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Product",
};

export default function Product() {
    return <ProductComponent />
}
