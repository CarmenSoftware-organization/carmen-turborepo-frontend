'use client';

import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash } from 'lucide-react';
import SkeletonTableLoading from '@/components/ui-custom/Loading/SkeltonTableLoading';
import { Badge } from '../ui-custom/is-active-badge';
import * as m from '@/paraglide/messages.js';

type FieldValue = string | number | boolean | null | undefined;

type RenderFunction<T> = (value: T[keyof T], item: T) => React.ReactNode;

type SuccessCallback<T> = (updatedItem: T, oldItem: T) => void | Promise<void>;

interface FieldConfig<T> {
    key: keyof T;
    label: string;
    type?: 'text' | 'badge' | 'custom';
    render?: RenderFunction<T>;
    width?: string;
    align?: 'left' | 'center' | 'right';
}

interface DeleteDialogProps {
    title?: string;
    description?: string;
    confirmLabel?: string;
}

interface DataTableProps<T extends Record<string, FieldValue>> {
    items: T[];
    fields: FieldConfig<T>[];
    idField: keyof T;
    onSuccess?: SuccessCallback<T>;
    onDelete?: (id: string) => void;
    isLoading?: boolean;
    showIndex?: boolean;
    editComponent?: (props: {
        item: T;
        onSuccess: (updatedItem: T) => void;
    }) => React.ReactNode;
    deleteDialogProps?: DeleteDialogProps;
}

const DataTable = <T extends Record<string, FieldValue>>({
    items,
    fields,
    idField,
    onSuccess,
    onDelete,
    isLoading,
    showIndex = true,
    editComponent,
    deleteDialogProps = {
        title: `${m.are_you_sure()}`,
        description: `${m.delete_dialog_des()}`,
        confirmLabel: `${m.delete_text()}`,
    },
}: DataTableProps<T>): React.ReactElement => {

    const handleDelete = (id: string): void => {
        if (onDelete) {
            onDelete(id);
        }
    };

    const handleSuccess = (updatedItem: T, originalItem: T): void => {
        if (onSuccess) {
            onSuccess(updatedItem, originalItem);
        }
    };

    const renderCell = (field: FieldConfig<T>, item: T): React.ReactNode => {
        const value = item[field.key];

        if (field.render) {
            return field.render(value, item);
        }

        switch (field.type) {
            case 'badge':
                if (typeof value === 'boolean') {
                    return (
                        <Badge variant={value ? 'default' : 'destructive'}>
                            {value ? `${m.status_active()}` : `${m.status_inactive()}`}
                        </Badge>
                    );
                }
                return <Badge>{String(value)}</Badge>;

            default:
                return String(value);
        }
    };

    const renderActionsCell = (item: T): React.ReactNode => (
        <div className="flex justify-end">
            {editComponent && editComponent({
                item,
                onSuccess: (updatedItem: T) => handleSuccess(updatedItem, item)
            })}
            {onDelete && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <Trash className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{deleteDialogProps.title}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {deleteDialogProps.description}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{m.cancel_text()}</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => handleDelete(String(item[idField]))}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                {deleteDialogProps.confirmLabel}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );

    if (isLoading) {
        return <SkeletonTableLoading />;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {showIndex && (
                        <TableHead className="w-[50px]">#</TableHead>
                    )}
                    {fields.map((field) => (
                        <TableHead
                            key={String(field.key)}
                            className={field.width ? `w-[${field.width}]` : undefined}
                            style={{ textAlign: field.align }}
                        >
                            {field.label}
                        </TableHead>
                    ))}
                    {(editComponent || onDelete) && (
                        <TableHead className="text-right">{m.action_text()}</TableHead>
                    )}
                </TableRow>
            </TableHeader>
            <TableBody>
                {items?.map((item, index) => (
                    <TableRow key={String(item[idField])}>
                        {showIndex && (
                            <TableCell>{index + 1}</TableCell>
                        )}
                        {fields.map((field) => (
                            <TableCell
                                key={`${String(item[idField])}-${String(field.key)}`}
                                style={{ textAlign: field.align }}
                            >
                                {renderCell(field, item)}
                            </TableCell>
                        ))}
                        {(editComponent || onDelete) && (
                            <TableCell className="bg-background text-right sticky right-0 shadow-[-8px_0_8px_-4px_rgba(0,0,0,0.05)">
                                {renderActionsCell(item)}
                            </TableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default DataTable;