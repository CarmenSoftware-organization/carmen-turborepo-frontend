import { formType } from "@/dtos/form.dto";
import VendorForm from "../components/vendor-form";

export default function NewVendor() {
    return <VendorForm mode={formType.ADD} />
}
