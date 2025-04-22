import { formType } from "@/dtos/form.dto";
import FormProduct from "../components/form/FormProduct";

export default function ProductNew() {
    return <FormProduct mode={formType.ADD} />
}