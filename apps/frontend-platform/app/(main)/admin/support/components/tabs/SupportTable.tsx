import { TicketType } from '@/types/main'
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'

interface SupportTableProps {
    tickets: TicketType[]
}
const SupportTable = ({ tickets }: SupportTableProps) => {
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
                            <Badge variant={ticket.status === 'open' ? 'default' : ticket.status === 'closed' ? 'secondary' : 'outline'}>
                                {ticket.status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant={ticket.priority === 'low' ? 'default' : ticket.priority === 'medium' ? 'secondary' : 'destructive'}>
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
export default SupportTable;