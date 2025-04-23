import { JournalEntryGrnDto } from "../../type.dto";

interface JournalEntriesProps {
    readonly journalEntries?: JournalEntryGrnDto;
}

export default function JournalEntries({ journalEntries }: JournalEntriesProps) {
    return (
        <div>
            <pre>{JSON.stringify(journalEntries, null, 2)}</pre>
        </div>
    )
}
