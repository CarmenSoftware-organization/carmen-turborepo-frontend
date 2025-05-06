import PurchaseRequestTemplateComponent from "./components/PurchaseRequestTemplateComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Purchase Request Template",
};

export default function PurchaseRequestTemplatePage() {
    return <PurchaseRequestTemplateComponent />;
} 