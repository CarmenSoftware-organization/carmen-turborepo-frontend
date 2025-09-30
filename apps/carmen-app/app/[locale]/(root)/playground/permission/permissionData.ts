enum Role {
    ADMIN = "admin",
    USER = "user",
}

interface User {
    id: string;
    name: string;
    role: Role;
    permissions: string[];
}


export interface DocumentDto {
    id: string;
    title: string;
    ownerId: string;
}

export const usersPermissionTest: User[] = [
    {
        id: "1",
        name: "Alice",
        role: Role.ADMIN,
        permissions: [
            "view",
            "view_all",
            "create",
            "edit",
            "delete",
        ],
    },
    {
        id: "2",
        name: "Bob",
        role: Role.USER,
        permissions: [
            "view",
            "create",
            "edit",
        ],
    },
    {
        id: "3",
        name: "Charlie",
        role: Role.USER,
        permissions: [
            "view",
        ],
    },
    {
        id: "4",
        name: "David",
        role: Role.USER,
        permissions: [
            "view",
            "delete",
        ],
    },
    {
        id: "5",
        name: "Eve",
        role: Role.USER,
        permissions: [],
    },
];


export const DocData: DocumentDto[] = [
    { id: "doc1", title: "Document 1", ownerId: "3" },
    { id: "doc2", title: "Document 2", ownerId: "2" },
    { id: "doc3", title: "Document 3", ownerId: "2" },
    { id: "doc4", title: "Document 4", ownerId: "1" },
    { id: "doc5", title: "Document 5", ownerId: "1" },
    { id: "doc6", title: "Document 6", ownerId: "3" },
    { id: "doc7", title: "Document 7", ownerId: "4" },
    { id: "doc8", title: "Document 8", ownerId: "5" },
]