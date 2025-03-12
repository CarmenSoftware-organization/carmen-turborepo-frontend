import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react";

interface Props {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    onConfirm: () => void;
    isLoading?: boolean;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: 'default' | 'destructive' | 'outline';
}

const ConfirmDialog: React.FC<Props> = ({
    isOpen,
    onOpenChange,
    title,
    description,
    onConfirm,
    isLoading = false,
    confirmText = 'Save',
    cancelText = 'Cancel',
    confirmVariant = 'default'
}) => {
    const handleConfirm = () => {
        onConfirm();
        if (!isLoading) {
            onOpenChange(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className='text-blue-950'>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className={`
                            ${confirmVariant === 'default' ? 'bg-blue-950 hover:bg-blue-900' : ''}
                            ${confirmVariant === 'destructive' ? 'bg-red-600 hover:bg-red-700' : ''}
                            ${confirmVariant === 'outline' ? 'border-2 border-blue-950 text-blue-950 hover:bg-blue-50' : ''}
                            ${isLoading ? 'cursor-not-allowed opacity-70' : ''}
                        `}
                        onClick={handleConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            confirmText
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ConfirmDialog;