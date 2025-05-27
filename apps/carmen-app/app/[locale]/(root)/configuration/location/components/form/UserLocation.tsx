import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState } from "react";

interface User {
    id: string;
    name: string;
}

interface UserField {
    user_id: string;
    key: string; // React Hook Form's internal key
    [key: string]: unknown;
}

interface UserLocationProps {
    readonly isReadOnly: boolean;
    readonly userList?: User[];
    readonly addUserFields?: UserField[];
    readonly onAddUser?: (userId: string) => void;
    readonly onRemoveUser?: (userId: string) => void;
}

export default function UserLocation({
    isReadOnly,
    userList,
    addUserFields = [],
    onAddUser,
    onRemoveUser
}: UserLocationProps) {

    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    if (isReadOnly) {
        return null;
    }

    const handleUserToggle = (userId: string, checked: boolean) => {
        if (checked) {
            setSelectedUsers(prev => [...prev, userId]);
        } else {
            setSelectedUsers(prev => prev.filter(id => id !== userId));
        }
    };

    const handleConfirmAdd = () => {
        console.log('🔍 handleConfirmAdd - selectedUsers:', selectedUsers);
        console.log('🔍 handleConfirmAdd - addUserFields before:', addUserFields);

        selectedUsers.forEach(userId => {
            // Check if user is not already added
            const isAlreadyAdded = addUserFields.some(field => field.user_id === userId);
            console.log(`🔍 User ${userId} already added:`, isAlreadyAdded);
            if (!isAlreadyAdded && onAddUser) {
                console.log(`🔍 Adding user:`, userId);
                onAddUser(userId);
            }
        });
        setSelectedUsers([]);
    };

    const handleRemoveUser = (userId: string) => {
        console.log('🔍 handleRemoveUser - userId:', userId);
        if (onRemoveUser) {
            onRemoveUser(userId);
        }
    };

    // Get assigned user IDs for display - using 'user_id' field
    const assignedUserIds = addUserFields.map(field => field.user_id).filter(id => id && typeof id === 'string' && id.trim() !== "");

    console.log('🔍 UserLocation - addUserFields:', addUserFields);
    console.log('🔍 UserLocation - assignedUserIds:', assignedUserIds);
    console.log('🔍 UserLocation - userList:', userList);

    // Debug: Check each field in addUserFields
    addUserFields.forEach((field, index) => {
        console.log(`🔍 addUserFields[${index}]:`, field);
        console.log(`🔍 addUserFields[${index}].user_id:`, field.user_id);
        console.log(`🔍 addUserFields[${index}].key (internal):`, field.key);
        console.log(`🔍 addUserFields[${index}] keys:`, Object.keys(field));
    });

    // Get available (unassigned) users
    const availableUsers = userList?.filter(user => !assignedUserIds.includes(user.id)) || [];

    console.log('🔍 UserLocation - availableUsers:', availableUsers);

    return (
        <Card className="p-4">
            <p className="text-sm font-medium mb-3">User Management</p>

            <div className="grid grid-cols-12 gap-4">
                {/* Available Users */}
                <div className="col-span-5">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-medium">Available Users</h4>
                        <span className="text-xs">({availableUsers.length})</span>
                    </div>
                    <div className="h-48 overflow-y-auto border rounded">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs font-medium py-1 px-2 w-8">
                                        <Checkbox
                                            checked={selectedUsers.length === availableUsers.length && availableUsers.length > 0}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedUsers(availableUsers.map(u => u.id));
                                                } else {
                                                    setSelectedUsers([]);
                                                }
                                            }}
                                            className="scale-75"
                                        />
                                    </TableHead>
                                    <TableHead className="text-xs font-medium py-1 px-2">Name</TableHead>
                                    <TableHead className="text-xs font-medium py-1 px-2">ID</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {availableUsers.map(user => {
                                    const isSelected = selectedUsers.includes(user.id);

                                    return (
                                        <TableRow key={user.id} className="text-xs">
                                            <TableCell className="py-1 px-2">
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={(checked) => handleUserToggle(user.id, checked as boolean)}
                                                    className="scale-75"
                                                />
                                            </TableCell>
                                            <TableCell className="py-1 px-2">{user.name || '-'}</TableCell>
                                            <TableCell className="py-1 px-2">{user.id}</TableCell>
                                        </TableRow>
                                    );
                                })}
                                {availableUsers.length === 0 && (
                                    <TableRow>
                                        <TableCell className="text-center py-2 text-xs" colSpan={3}>
                                            {userList && userList.length > 0 ? "All users assigned" : "No users found"}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-2">
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleConfirmAdd}
                            disabled={selectedUsers.length === 0}
                            className="h-7 px-3 text-xs"
                        >
                            Add Selected ({selectedUsers.length})
                        </Button>
                    </div>
                </div>

                {/* Arrow */}
                <div className="col-span-2 flex items-center justify-center">
                    <div className="text-2xl text-gray-400">→</div>
                </div>

                {/* Assigned Users */}
                <div className="col-span-5">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-medium">Assigned Users</h4>
                        <span className="text-xs">({assignedUserIds.length})</span>
                    </div>
                    <div className="h-48 overflow-y-auto border rounded">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs font-medium py-1 px-2">Name</TableHead>
                                    <TableHead className="text-xs font-medium py-1 px-2">ID</TableHead>
                                    <TableHead className="text-xs font-medium py-1 px-2 w-16">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assignedUserIds.map(userId => {
                                    const user = userList?.find(u => u.id === userId);
                                    console.log(`🔍 Assigned user ${userId} found in userList:`, user);
                                    return (
                                        <TableRow key={userId} className="text-xs">
                                            <TableCell className="py-1 px-2">{user?.name || '-'}</TableCell>
                                            <TableCell className="py-1 px-2">{userId}</TableCell>
                                            <TableCell className="py-1 px-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleRemoveUser(userId)}
                                                    className="h-6 w-6 p-0 text-xs"
                                                >
                                                    ×
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {assignedUserIds.length === 0 && (
                                    <TableRow>
                                        <TableCell className="text-center py-2 text-xs" colSpan={3}>
                                            No assigned users
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Debug Section */}
            <div className="mt-4 p-2 bg-yellow-50 border rounded text-xs">
                <h4 className="font-medium mb-2">🔍 Debug Information</h4>
                <div className="space-y-1">
                    <div><strong>addUserFields length:</strong> {addUserFields.length}</div>
                    <div><strong>assignedUserIds:</strong> [{assignedUserIds.join(', ')}]</div>
                    <div><strong>selectedUsers:</strong> [{selectedUsers.join(', ')}]</div>
                    <div><strong>availableUsers count:</strong> {availableUsers.length}</div>
                </div>
                <div className="mt-2">
                    <strong>addUserFields structure:</strong>
                    <pre className="text-xs bg-white p-1 rounded border mt-1">
                        {JSON.stringify(addUserFields, null, 2)}
                    </pre>
                </div>
            </div>
        </Card>
    );
}
