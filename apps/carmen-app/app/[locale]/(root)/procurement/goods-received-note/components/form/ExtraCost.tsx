import { ExtraCostGrnDto } from "../../type.dto";

interface ExtraCostProps {
    readonly extraCost?: ExtraCostGrnDto[];
}
export default function ExtraCost({ extraCost }: ExtraCostProps) {
    return (
        <div>
            <pre>{JSON.stringify(extraCost, null, 2)}</pre>
        </div>
    )
}
