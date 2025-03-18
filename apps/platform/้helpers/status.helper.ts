export const getStatusVariant = (status: string): "default" | "secondary" | "outline" => {
    if (status === 'open') return 'default';
    if (status === 'closed') return 'secondary';
    return 'outline';
};

export const getPriorityVariant = (priority: string): "default" | "secondary" | "destructive" => {
    if (priority === 'low') return 'default';
    if (priority === 'medium') return 'secondary';
    return 'destructive';
};
