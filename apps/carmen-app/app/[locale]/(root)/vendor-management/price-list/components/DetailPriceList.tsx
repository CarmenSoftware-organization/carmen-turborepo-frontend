import { PriceListDto } from "@/dtos/price-list.dto";

interface DetailPriceListProps {
    readonly priceList: PriceListDto;
}

export default function DetailPriceList({ priceList }: DetailPriceListProps) {
    return (
        <div>
            <pre>{JSON.stringify(priceList, null, 2)}</pre>
        </div>
    )
}
