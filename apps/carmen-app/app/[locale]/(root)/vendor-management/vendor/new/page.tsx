import { formType } from "@/dtos/form.dto";
import FormVendor from "../components/FormVendor";
export default function VendorNewPage() {
    return <FormVendor mode={formType.ADD} />
}
