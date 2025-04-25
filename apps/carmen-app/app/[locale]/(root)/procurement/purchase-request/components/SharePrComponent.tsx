import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, Mail, MoreHorizontal, SquarePen, Trash } from "lucide-react";

export interface SelectionProps {
    selectedItems: string[];
    onSelectItem: (id: string) => void;
    onSelectAll: () => void;
    isAllSelected: boolean;
    totalItems?: number;
}

export const prStatusColor = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
        'draft': { color: 'bg-gray-200 text-gray-700', label: 'Draft' },
        'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
        'approved': { color: 'bg-green-100 text-green-800', label: 'Approved' },
        'rejected': { color: 'bg-red-100 text-red-800', label: 'Rejected' },
        'in_progress': { color: 'bg-blue-100 text-blue-800', label: 'In Progress' },
        'completed': { color: 'bg-emerald-100 text-emerald-800', label: 'Completed' }
    };

    const { color, label } = statusMap[status.toLowerCase()] || { color: 'bg-gray-200 text-gray-700', label: status };

    return (
        <Badge className={`${color} font-normal`}>
            {label}
        </Badge>
    );
};

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount);
};

export const ActionButtons = ({ prId }: { prId: string }) => {
    return (
        <div className="flex items-center justify-end">
            <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7"
                aria-label="View purchase request"
                data-id={`view-pr-${prId}`}
            >
                <Eye className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7"
                aria-label="Edit purchase request"
                data-id={`edit-pr-${prId}`}
            >
                <SquarePen className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 text-destructive hover:text-destructive/80"
                aria-label="Delete purchase request"
                data-id={`delete-pr-${prId}`}
            >
                <Trash />
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Reject
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Mail />
                        Send Email
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}; 