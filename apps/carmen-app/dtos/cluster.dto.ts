export type ClusterPostDto = {
    code: string;
    name: string;
    is_active: boolean;
}

export type ClusterGetDto = {
    id: string;
    code: string;
    name: string;
    is_active: boolean;
    info?: string;
}

