import { formType } from "@/dtos/form.dto";
import ProductForm from "../components/ProductForm";
import { mockProductDetails } from "@/mock-data/product";

export default function ProductEdit() {
    return <ProductForm mode={formType.EDIT} product={mockProductDetails} />
}
