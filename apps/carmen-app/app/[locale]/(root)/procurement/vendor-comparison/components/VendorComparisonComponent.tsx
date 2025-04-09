import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { mockVendorComparisonData } from "@/mock-data/procurement";
import VendorComparisonList from "./VendorComparisonList";

export default function VendorComparisonComponent() {
    const title = "Vendor Comparison"

    const content = <VendorComparisonList vendorComparisons={mockVendorComparisonData} />

    return (
        <DataDisplayTemplate
            title={title}
            content={content}
        />
    );
}
