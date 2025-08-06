import { Metadata } from "next";
import VendorPage from "./VendorPage";


export const metadata: Metadata = {
    title: "Vendor Management",
};
export default function VendorManagement() {
    return <VendorPage />
}
