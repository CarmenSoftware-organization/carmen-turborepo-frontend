import { formType } from "@/dtos/form.dto";
import { ProductDto } from "@/dtos/product.dto";

interface ProductFormProps {
    readonly mode: formType;
    readonly product?: ProductDto;
}

export default function ProductForm({ mode, product }: ProductFormProps) {
    return (
        <div>
            <h1>{mode}</h1>
            <pre>{JSON.stringify(product, null, 2)}</pre>
        </div>
    )
}
