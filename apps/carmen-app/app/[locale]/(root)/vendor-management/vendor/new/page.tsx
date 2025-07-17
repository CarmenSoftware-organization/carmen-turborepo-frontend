import { formType } from "@/dtos/form.dto";
import VendorForm from "../components/form/VendorForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "New Vendor",
};

export default function NewVendor() {
    return <VendorForm mode={formType.ADD} />
}
