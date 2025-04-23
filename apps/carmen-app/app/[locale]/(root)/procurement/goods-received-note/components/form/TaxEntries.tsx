import { TaxEntryGrnDto } from "../../type.dto";

interface TaxEntriesProps {
    readonly taxEntries?: TaxEntryGrnDto;
}

export default function TaxEntries({ taxEntries }: TaxEntriesProps) {
    return (
        <div>
            <pre>{JSON.stringify(taxEntries, null, 2)}</pre>
        </div>
    )
}
