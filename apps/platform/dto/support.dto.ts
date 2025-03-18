
export type TicketType = {
    ticket_id: string;
    subject: string;
    tenant: string;
    status: "open" | "closed" | "pending";
    priority: "low" | "medium" | "high";
    assigned: string;
    created_at: string;
    updated_at: string;
};

export type SupportType = {
    tickets: {
        total: number;
        new: number;
    };
    average_response_time: {
        time: number;
        response_time: number;
    };
    resolution_rate: {
        rate: number;
        resolution_rate: number;
    };
    critical_issues: {
        total: number;
        resolved: number;
    };
    support_results: TicketType[];
};