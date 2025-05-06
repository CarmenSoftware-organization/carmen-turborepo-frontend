import VendorComparisonComponent from "./components/VendorComparisonComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Vendor Comparison",
};

export default function VendorComparisonPage() {
    return <VendorComparisonComponent />
}
