import PurchaseRequestApprovalComponent from "./components/PurchaseRequestApprovalComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Purchase Request Approval",
};

export default function PurchaseRequestApprovalPage() {
    return <PurchaseRequestApprovalComponent />;
} 