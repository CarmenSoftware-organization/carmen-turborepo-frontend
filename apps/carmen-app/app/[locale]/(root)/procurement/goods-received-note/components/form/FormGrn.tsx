"use client";

import { Button } from "@/components/ui/button";
import { formType } from "@/dtos/form.dto";
import { useRouter } from "@/lib/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { useState } from "react";
import ActivityLog from "../ActivityLog";
import CommentGrn from "../CommentGrn";
import { Card } from "@/components/ui/card";

interface FormGrnProps {
    readonly mode: formType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly initialValues?: any;
}

const ActionButtons = ({
    currentMode,
    handleModeChange,
    handleSave,
    onBack
}: {
    currentMode: formType;
    handleModeChange: (mode: formType) => void;
    handleSave: () => void;
    onBack: () => void;
}) => {

    if (currentMode === formType.ADD) {
        return (
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
                <Button variant="default" size="sm" onClick={handleSave}>
                    Save
                </Button>
            </div>
        );
    }

    if (currentMode === formType.VIEW) {
        return (
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
                <Button variant="default" size="sm" onClick={() => handleModeChange(formType.EDIT)}>
                    <Pencil className="h-4 w-4" />
                    Edit
                </Button>
            </div>
        );
    }

    if (currentMode === formType.EDIT) {
        return (
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleModeChange(formType.VIEW)}>
                    Cancel
                </Button>
                <Button variant="default" size="sm" onClick={handleSave}>
                    Save
                </Button>
            </div>
        );
    }

    return null;
};

export default function FormGrn({ mode, initialValues }: FormGrnProps) {
    const router = useRouter();
    const [currentMode, setCurrentMode] = useState(mode);

    const handleModeChange = (mode: formType) => {
        setCurrentMode(mode);
    };

    const handleSave = () => {
        alert('save');
        setCurrentMode(formType.VIEW);
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="space-y-4">


            <div className="flex gap-4">
                <Card className="w-3/4 p-4">
                    <div className="flex items-center gap-4">
                        <h1>Mode: {currentMode}</h1>
                        <ActionButtons
                            currentMode={currentMode}
                            handleModeChange={handleModeChange}
                            handleSave={handleSave}
                            onBack={handleBack}
                        />
                    </div>
                    {initialValues && (
                        <pre>{JSON.stringify(initialValues, null, 2)}</pre>
                    )}
                </Card>

                <div className="w-1/4">
                    <div className="flex flex-col gap-4">
                        <CommentGrn />
                        <ActivityLog />
                    </div>
                </div>

            </div>


        </div>
    );
}

