import { Metadata } from "next";
import ProductionComponentPage from "./ProductionComponentPage";
export const metadata: Metadata = {
    title: "Production",
};

export default function ProductionPage() {
    return <ProductionComponentPage />
}
