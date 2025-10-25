import PriceComparisonComponent from "./_components/PriceComparisonComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Price Comparison",
};

export default function PriceComparisonPage() {
    return <PriceComparisonComponent />
}
