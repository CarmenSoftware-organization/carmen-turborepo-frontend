import { formType } from "@/dtos/form.dto";
import ProductDetail from "../components/ProductDetail";

export default function ProductNew() {
    return <ProductDetail mode={formType.ADD} />
}