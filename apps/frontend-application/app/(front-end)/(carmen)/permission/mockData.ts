import { ResourceType, UserType } from "./policy";

export const mockComments: ResourceType[] = [
    // BU1 Comments
    {
        id: '1',
        ownerId: '2', // Support Boss BU1
        bu: 'BU1',
        visibility: 'public',
        content: 'Support Boss Public Comment BU1'
    },
    {
        id: '2',
        ownerId: '3', // Support Subordinate BU1
        bu: 'BU1',
        visibility: 'private',
        content: 'Support Subordinate Private Comment BU1'
    },
    {
        id: '3',
        ownerId: '4', // User Boss BU1
        bu: 'BU1',
        visibility: 'public',
        content: 'User Boss Public Comment BU1'
    },
    {
        id: '4',
        ownerId: '5', // User Subordinate BU1
        bu: 'BU1',
        visibility: 'private',
        content: 'User Subordinate Private Comment BU1'
    },
    // BU2 Comments
    {
        id: '5',
        ownerId: '6', // Support Boss BU2
        bu: 'BU2',
        visibility: 'public',
        content: 'Support Boss Public Comment BU2'
    },
    {
        id: '6',
        ownerId: '7', // Support Subordinate BU2
        bu: 'BU2',
        visibility: 'private',
        content: 'Support Subordinate Private Comment BU2'
    },
    {
        id: '7',
        ownerId: '8', // User Boss BU2
        bu: 'BU2',
        visibility: 'public',
        content: 'User Boss Public Comment BU2'
    },
    {
        id: '8',
        ownerId: '9', // User Subordinate BU2
        bu: 'BU2',
        visibility: 'private',
        content: 'User Subordinate Private Comment BU2'
    }
];

export const mockUsers: UserType[] = [
    { id: '1', role: 'admin', subRole: 'boss' },
    { id: '2', role: 'support', subRole: 'boss', bu: 'BU1' },
    { id: '3', role: 'support', subRole: 'subordinate', bu: 'BU1' },
    { id: '4', role: 'user', subRole: 'boss', bu: 'BU1' },
    { id: '5', role: 'user', subRole: 'subordinate', bu: 'BU1' },
    { id: '6', role: 'support', subRole: 'boss', bu: 'BU2' },
    { id: '7', role: 'support', subRole: 'subordinate', bu: 'BU2' },
    { id: '8', role: 'user', subRole: 'boss', bu: 'BU2' },
    { id: '9', role: 'user', subRole: 'subordinate', bu: 'BU2' },
];