"use client";
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, LockKeyhole } from 'lucide-react';
import {
    ProcurementModules,
    Module,
    UserRole,
} from './mockModule';
import { ModulePermissions } from './modulePermissions';

interface User {
    id: string;
    name: string;
    role: UserRole;
}

const CurrentUser: User = {
    id: "user_001",
    name: "Daew Carmen",
    role: UserRole.STAFF
};

const checkPermission = (moduleId: string, user: User): boolean => {
    const modulePermission = ModulePermissions[moduleId];
    return modulePermission
        ? modulePermission.requiredRole.includes(user.role)
        : false;
};

const WidgetPage = () => {
    const [modules, setModules] = useState(ProcurementModules);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);

    const handleStatusToggle = (module: Module) => {
        if (checkPermission(module.id, CurrentUser)) {
            setSelectedModule(module);
            setIsDialogOpen(true);
        }
    };

    const confirmStatusChange = () => {
        if (selectedModule) {
            setModules((prevModules) =>
                prevModules.map((module) =>
                    module.id === selectedModule.id
                        ? { ...module, status: !module.status }
                        : module
                )
            );
        }
        setIsDialogOpen(false);
    };

    const cancelStatusChange = () => {
        setIsDialogOpen(false);
    };

    const processedModules = modules.map((module) => {
        const hasViewPermission = checkPermission(module.id, CurrentUser);

        return {
            ...module,
            hasViewPermission,
        };
    });

    return (
        <div>
            <div className="mb-4 bg-gray-100 p-2 rounded">
                <p>ผู้ใช้ปัจจุบัน: {CurrentUser.name} (บทบาท: {CurrentUser.role})</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-4">
                {processedModules.map((module) => (
                    <Card
                        key={module.id}
                        className={`relative border p-4 ${!module.hasViewPermission ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        {module.status === false && module.hasViewPermission && (
                            <div
                                className="absolute top-2 right-2 cursor-pointer"
                                onClick={() => handleStatusToggle(module)}
                            >
                                <ShoppingCart className="h-5 w-5 text-blue-500" />
                            </div>
                        )}

                        {module.status === true && !module.hasViewPermission && (
                            <div className="absolute top-2 right-2">
                                <LockKeyhole className="h-5 w-5 text-red-500" />
                            </div>
                        )}
                        {module.name}
                    </Card>
                ))}

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{selectedModule?.name}</DialogTitle>
                            <DialogDescription>
                                คุณต้องการเปลี่ยนสถานะของโมดูล {selectedModule?.name} หรือไม่?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="secondary" onClick={cancelStatusChange}>
                                ยกเลิก
                            </Button>
                            <Button variant="default" onClick={confirmStatusChange}>
                                ยืนยัน
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default WidgetPage;