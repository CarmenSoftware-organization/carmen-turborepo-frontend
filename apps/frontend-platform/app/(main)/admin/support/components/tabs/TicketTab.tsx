import React from 'react'
import { TicketType } from '@/types/main';
import SupportTable from './SupportTable';

interface TicketTabProps {
    tickets: TicketType[];
}
const TicketTab = ({ tickets }: TicketTabProps) => {
    return <SupportTable tickets={tickets} />
}

export default TicketTab