import { TicketType } from "@/dto/support.dto";

interface TicketTabProps {
    readonly tickets: TicketType[];
}

export default function TicketTab({ tickets }: TicketTabProps) {
    return (
        <div>
            <h1>Ticket Tab</h1>
        </div>
    )
}
