import PriceListComponent from "./_components/PriceListComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Price List",
};

export default function PriceListPage() {
    return <PriceListComponent />
}
