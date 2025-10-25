import PurchaseRequestComponent from "./_components/PurchaseRequestComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Purchase Request",
};
export default function PurchaseRequestPage() {
    return <PurchaseRequestComponent />
}
