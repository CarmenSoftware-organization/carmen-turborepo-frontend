import { StockMovementGrnDto } from "../../type.dto";

interface StockMovementProps {
    readonly stockMovement?: StockMovementGrnDto[];
}
export default function StockMovement({ stockMovement }: StockMovementProps) {
    return (
        <div>
            <pre>{JSON.stringify(stockMovement, null, 2)}</pre>
        </div>
    )
}

