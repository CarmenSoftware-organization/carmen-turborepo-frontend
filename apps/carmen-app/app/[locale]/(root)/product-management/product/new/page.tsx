import { formType } from "@/dtos/form.dto";
import ProductForm from "../components/ProductForm";

export default function ProductNew() {
    return <ProductForm mode={formType.ADD} />
}