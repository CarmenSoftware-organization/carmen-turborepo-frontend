import { Control, FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";
import { Plus, Minus, ArrowRight, ArrowLeft } from "lucide-react";
import { CreateStoreLocationDto } from "@/dtos/config.dto";
import { useUserList } from "@/hooks/useUserList";
import { useState } from "react";

interface UserLocationProps {
    readonly control: Control<CreateStoreLocationDto>;
    readonly isReadOnly: boolean;
    readonly addUserFields: FieldArrayWithId<CreateStoreLocationDto, "users.add", "id">[];
    readonly appendAddUser: UseFieldArrayAppend<CreateStoreLocationDto, "users.add">;
    readonly removeAddUser: UseFieldArrayRemove;
    readonly removeUserFields: FieldArrayWithId<CreateStoreLocationDto, "users.remove", "id">[];
    readonly appendRemoveUser: UseFieldArrayAppend<CreateStoreLocationDto, "users.remove">;
    readonly removeRemoveUser: UseFieldArrayRemove;
}

export default function UserLocation({
    control,
    isReadOnly,
    addUserFields,
    appendAddUser,
    removeAddUser,
    removeUserFields,
    appendRemoveUser,
    removeRemoveUser
}: UserLocationProps) {

    const { userList } = useUserList();

    console.log(userList);

    const [selectedAvailableUsers, setSelectedAvailableUsers] = useState<string[]>([]);
    const [selectedAssignedUsers, setSelectedAssignedUsers] = useState<string[]>([]);

    if (isReadOnly) {
        return null;
    }

    // Get currently assigned user IDs
    const assignedUserIds = addUserFields.map(field => field.id).filter(id => id.trim() !== "");

    // Filter available users (exclude already assigned ones)
    const availableUsers = userList?.filter(user => !assignedUserIds.includes(user.id)) || [];

    // Select all logic for available users
    const isAllAvailableSelected = availableUsers.length > 0 && selectedAvailableUsers.length === availableUsers.length;

    // Select all logic for assigned users
    const isAllAssignedSelected = assignedUserIds.length > 0 && selectedAssignedUsers.length === assignedUserIds.length;

    const handleMoveToAssigned = () => {
        selectedAvailableUsers.forEach(userId => {
            appendAddUser({ id: userId });
        });
        setSelectedAvailableUsers([]);
    };

    const handleMoveToAvailable = () => {
        selectedAssignedUsers.forEach(userId => {
            const index = addUserFields.findIndex(field => field.id === userId);
            if (index !== -1) {
                removeAddUser(index);
            }
        });
        setSelectedAssignedUsers([]);
    };

    const toggleAvailableUser = (userId: string, checked: boolean) => {
        setSelectedAvailableUsers(prev =>
            checked
                ? [...prev, userId]
                : prev.filter(id => id !== userId)
        );
    };

    const toggleAssignedUser = (userId: string, checked: boolean) => {
        setSelectedAssignedUsers(prev =>
            checked
                ? [...prev, userId]
                : prev.filter(id => id !== userId)
        );
    };

    const handleSelectAllAvailable = (checked: boolean) => {
        if (checked) {
            setSelectedAvailableUsers(availableUsers.map(user => user.id));
        } else {
            setSelectedAvailableUsers([]);
        }
    };

    const handleSelectAllAssigned = (checked: boolean) => {
        if (checked) {
            setSelectedAssignedUsers([...assignedUserIds]);
        } else {
            setSelectedAssignedUsers([]);
        }
    };

    return (
        <Card className="p-4">
            <p className="text-sm font-medium mb-3">Users Management</p>

            <div className="grid grid-cols-12 gap-4">
                {/* Available Users Table */}
                <div className="col-span-5">
                    <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs font-medium">Available Users</Label>
                        <span className="text-xs">({availableUsers.length})</span>
                    </div>
                    <div className="h-32 overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs font-medium py-1 px-2 w-8">
                                        <Checkbox
                                            checked={isAllAvailableSelected}
                                            onCheckedChange={handleSelectAllAvailable}
                                            className="scale-75"
                                        />
                                    </TableHead>
                                    <TableHead className="text-xs font-medium py-1 px-2">Name</TableHead>
                                    <TableHead className="text-xs font-medium py-1 px-2">ID</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {availableUsers.map(user => (
                                    <TableRow key={user.id} className="text-xs">
                                        <TableCell className="py-1 px-2">
                                            <Checkbox
                                                checked={selectedAvailableUsers.includes(user.id)}
                                                onCheckedChange={(checked) => toggleAvailableUser(user.id, checked as boolean)}
                                                className="scale-75"
                                            />
                                        </TableCell>
                                        <TableCell className="py-1 px-2">{user.name || '-'}</TableCell>
                                        <TableCell className="py-1 px-2">{user.id}</TableCell>
                                    </TableRow>
                                ))}
                                {availableUsers.length === 0 && (
                                    <TableRow>
                                        <TableCell className="text-center py-2 text-xs" colSpan={3}>
                                            No available users
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Arrow Controls */}
                <div className="col-span-2 flex flex-col justify-center items-center space-y-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleMoveToAssigned}
                        disabled={selectedAvailableUsers.length === 0}
                        className="h-8 w-8 p-0"
                        title="Add selected users"
                    >
                        <ArrowRight className="w-3 h-3" />
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleMoveToAvailable}
                        disabled={selectedAssignedUsers.length === 0}
                        className="h-8 w-8 p-0"
                        title="Remove selected users"
                    >
                        <ArrowLeft className="w-3 h-3" />
                    </Button>
                </div>

                {/* Assigned Users Table */}
                <div className="col-span-5">
                    <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs font-medium">Assigned Users</Label>
                        <span className="text-xs">({assignedUserIds.length})</span>
                    </div>
                    <div className="h-32 overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs font-medium py-1 px-2 w-8">
                                        <Checkbox
                                            checked={isAllAssignedSelected}
                                            onCheckedChange={handleSelectAllAssigned}
                                            className="scale-75"
                                        />
                                    </TableHead>
                                    <TableHead className="text-xs font-medium py-1 px-2">Name</TableHead>
                                    <TableHead className="text-xs font-medium py-1 px-2">ID</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assignedUserIds.map(userId => {
                                    const user = userList?.find(u => u.id === userId);
                                    return (
                                        <TableRow key={userId} className="text-xs">
                                            <TableCell className="py-1 px-2">
                                                <Checkbox
                                                    checked={selectedAssignedUsers.includes(userId)}
                                                    onCheckedChange={(checked) => toggleAssignedUser(userId, checked as boolean)}
                                                    className="scale-75"
                                                />
                                            </TableCell>
                                            <TableCell className="py-1 px-2">{user?.name || '-'}</TableCell>
                                            <TableCell className="py-1 px-2">{userId}</TableCell>
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

            {/* Manual User ID Input (Fallback) */}
            <div className="mt-4 pt-3">
                <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs font-medium">Manual User ID Entry</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendAddUser({ id: "" })}
                        className="h-6 px-2 text-xs"
                    >
                        <Plus className="w-3 h-3 mr-1" />
                        Add
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {addUserFields.filter(field => field.id.trim() === "").map((field) => {
                        const actualIndex = addUserFields.findIndex(f => f.id === field.id && f === field);
                        return (
                            <div key={field.id} className="flex gap-1">
                                <FormField
                                    control={control}
                                    name={`users.add.${actualIndex}.id`}
                                    render={({ field: inputField }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter User ID"
                                                    {...inputField}
                                                    className="h-7 text-xs"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeAddUser(actualIndex)}
                                    className="h-7 w-7 p-0"
                                >
                                    <Minus className="w-3 h-3" />
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Remove Users Section (if needed) */}
            {removeUserFields.length > 0 && (
                <div className="mt-4 pt-3">
                    <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs font-medium">Users to Remove</Label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendRemoveUser({ id: "" })}
                            className="h-6 px-2 text-xs"
                        >
                            <Plus className="w-3 h-3 mr-1" />
                            Add
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {removeUserFields.map((field, index) => (
                            <div key={field.id} className="flex gap-1">
                                <FormField
                                    control={control}
                                    name={`users.remove.${index}.id`}
                                    render={({ field: inputField }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input
                                                    placeholder="User ID to remove"
                                                    {...inputField}
                                                    className="h-7 text-xs"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeRemoveUser(index)}
                                    className="h-7 w-7 p-0"
                                >
                                    <Minus className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
}
