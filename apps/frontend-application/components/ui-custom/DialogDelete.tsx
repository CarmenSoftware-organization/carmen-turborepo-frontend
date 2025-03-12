import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    idDelete: string | null | undefined
}

const DialogDelete: React.FC<Props> = ({ open, onOpenChange, onConfirm, idDelete }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete {idDelete} This action cannot be undone.
                </DialogDescription>
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={() => {
                        onConfirm();
                        onOpenChange(false);
                    }}>
                        Confirm
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DialogDelete;
