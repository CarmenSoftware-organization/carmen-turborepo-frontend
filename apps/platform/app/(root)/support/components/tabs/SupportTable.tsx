import { TicketType } from "@/dto/support.dto";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { getPriorityVariant, getStatusVariant } from "@/้helpers/status.helper";

interface Props {
    readonly tickets: TicketType[];
}
export default function SupportTable({ tickets }: Props) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assigned</TableHead>
                    <TableHead>Created At</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tickets.map((ticket) => (
                    <TableRow key={ticket.ticket_id}>
                        <TableCell>{ticket.ticket_id}</TableCell>
                        <TableCell>{ticket.subject}</TableCell>
                        <TableCell>{ticket.tenant}</TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant(ticket.status)}>
                                {ticket.status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant={getPriorityVariant(ticket.priority)}>
                                {ticket.priority}
                            </Badge>
                        </TableCell>
                        <TableCell>{ticket.assigned}</TableCell>
                        <TableCell>{format(new Date(ticket.created_at), 'dd/MM/yyyy')}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table >
    )
}
