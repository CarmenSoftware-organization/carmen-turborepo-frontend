import VendorComponent from "./components/VendorComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Vendor",
};

export default function Vendor() {
    return <VendorComponent />
}
