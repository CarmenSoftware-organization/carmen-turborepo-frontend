import { ProductLocationDto } from "@/dtos/config.dto";
import { useTranslations } from "next-intl";

interface Props {
    products: ProductLocationDto[];
}

export default function TabUsersProduct({ products }: Props) {
    const tCommon = useTranslations("Common");
    return (
        <div className="space-y-2">
            <h2 className="text-sm font-semibold">
                {tCommon("products")} ({products.length ?? 0})
            </h2>
            {(products.length ?? 0) > 0 ? (
                <ul className="space-y-1 h-[300px] overflow-y-auto text-sm pl-4 list-disc p-2">
                    {products.map((product) => (
                        <li key={product.id}>{product.name}</li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted-foreground text-xs text-center py-2">
                    {tCommon("data_not_found")}
                </p>
            )}
        </div>
    );
}