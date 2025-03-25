import { formType } from "@/dtos/form.dto";
import ProductForm from "../components/ProductForm";
import { mockProducts } from "@/mock-data/product";

export default function ProductEdit() {
    return <ProductForm mode={formType.EDIT} product={mockProducts[0]} />
}
