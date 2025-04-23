import { GrnItemDto } from "../../type.dto";

interface ItemGrnProps {
    readonly items?: GrnItemDto[];
}

export default function ItemGrn({ items }: ItemGrnProps) {
    return (
        <div>
            <pre>{JSON.stringify(items, null, 2)}</pre>
        </div>
    )
}
