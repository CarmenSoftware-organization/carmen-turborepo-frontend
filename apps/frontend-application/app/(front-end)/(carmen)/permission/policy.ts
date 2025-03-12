import { mockUsers } from "./mockData";

export type Role = 'admin' | 'support' | 'user';
export type SubRole = 'boss' | 'subordinate';

export type UserType = {
    id: string;
    role: Role;
    subRole?: SubRole;
    bu?: string;
};

export type ResourceType = {
    id: string;
    ownerId: string;
    bu: string;
    visibility: 'public' | 'private';
    content?: string;
};

const policies = [
    {
        action: 'create:comments',
        condition: (user: UserType) => {
            // Users can only create comments if they have a BU (except admin)
            return user.role === 'admin' || Boolean(user.bu);
        },
    },
    {
        action: 'read:comments',
        condition: (user: UserType, resource: ResourceType) => {
            // Admin เห็นได้ทุก BU
            if (user.role === 'admin') return true;

            // Support และ User เห็นได้เฉพาะ BU ตัวเอง
            if (!user.bu || !resource.bu) return false;
            return user.bu === resource.bu;
        },
    },
    {
        action: 'update:comments',
        condition: (user: UserType, resource: ResourceType) => {
            // Admin อัปเดตได้ทุก BU
            if (user.role === 'admin') return true;

            // Support อัปเดตได้ใน BU ตัวเอง
            if (user.role === 'support') {
                return user.bu === resource.bu;
            }

            // User สามารถอัปเดตความคิดเห็นของตัวเองได้
            return user.id === resource.ownerId && user.bu === resource.bu;
        },
    },
    {
        action: 'delete:comments',
        condition: (user: UserType, resource: ResourceType) => {
            // Admin ลบได้ทุก BU
            if (user.role === 'admin') return true;

            // Support ลบได้ใน BU ตัวเอง
            if (user.role === 'support') {
                return user.bu === resource.bu;
            }

            // User ไม่สามารถลบ comments ของนอื่น
            return false;
        },
    },
    {
        action: 'delete:ownComments',
        condition: (user: UserType, resource: ResourceType) => {
            // เจ้าของสามารถลบความคิดเห็นของตัวเองได้ เฉพาะใน BU ของตัวเอง
            return user.id === resource.ownerId && user.bu === resource.bu;
        },
    },
    {
        action: 'delete:subordinateComments',
        condition: (user: UserType, resource: ResourceType) => {
            // Boss can delete subordinate comments in their BU
            if (user.subRole !== 'boss') return false;
            
            // Check if in same BU
            if (user.bu !== resource.bu) return false;

            // Find the owner of the comment
            const commentOwner = mockUsers.find(u => u.id === resource.ownerId);
            if (!commentOwner) return false;

            // Can only delete if owner is subordinate
            return commentOwner.subRole === 'subordinate';
        },
    },
];

export const hasPermission = (
    user: UserType,
    action: string,
    resource?: ResourceType
): boolean => {
    // Early return if no resource or if user/resource doesn't have required BU
    if (!resource) return false;
    if (user.role !== 'admin' && !user.bu) return false;
    
    const policy = policies.find((p) => p.action === action);
    if (!policy) return false;
    
    return policy.condition(user, resource);
};



