"use client";

import { Button } from "@/components/ui/button";
import { formType } from "@/dtos/form.dto";
import { useRouter } from "@/lib/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, MessageCircle, Pencil, Printer } from "lucide-react";
import { useState } from "react";
import ActivityLog from "../ActivityLog";
import CommentGrn from "../CommentGrn";
import { Card } from "@/components/ui/card";
import { GrnDto } from "../../type.dto";
import GrnFormHeader from "./GrnFormHeader";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import ItemGrn from "./ItemGrn";
import ExtraCost from "./ExtraCost";
import StockMovement from "./StockMovement";
import TaxEntries from "./TaxEntries";
import JournalEntries from "./JournalEntries";
interface FormGrnProps {
    readonly mode: formType;
    readonly initialValues?: GrnDto;
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
                <Button variant="outline" size="sm" onClick={onBack}>
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
                <Button variant="outline" size="sm" onClick={onBack}>
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
                <Button variant="outline" size="sm" onClick={() => handleModeChange(formType.VIEW)}>
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
    const [openLog, setOpenLog] = useState(false);

    const handleModeChange = (mode: formType) => {
        setCurrentMode(mode);
    };

    const handleOpenLog = () => {
        setOpenLog(!openLog);
    };

    const handleSave = () => {
        alert('save');
        setCurrentMode(formType.VIEW);
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="space-y-4 relative">
            <div className="flex gap-4 relative">
                <Card className={`${openLog ? 'w-3/4' : 'w-full'} p-4 transition-all duration-300 ease-in-out`}>
                    <div className="flex items-center justify-between">
                        <h1>Mode: {currentMode}</h1>
                        <div className="flex items-center gap-2">
                            <ActionButtons
                                currentMode={currentMode}
                                handleModeChange={handleModeChange}
                                handleSave={handleSave}
                                onBack={handleBack}
                            />
                            <Button variant="outline" size="sm">
                                <Printer className="h-4 w-4" />
                                Print
                            </Button>
                            <Button variant="outline" size="sm">
                                <MessageCircle className="h-4 w-4" />
                                Comment
                            </Button>
                        </div>
                    </div>
                    <GrnFormHeader info={initialValues?.info} />

                    <Tabs defaultValue="items">
                        <TabsList>
                            <TabsTrigger value="items">Items</TabsTrigger>
                            <TabsTrigger value="extraCost">Extra Cost</TabsTrigger>
                            <TabsTrigger value="stockMovement">Stock Movement</TabsTrigger>
                            <TabsTrigger value="journalEntries">Journal Entries</TabsTrigger>
                            <TabsTrigger value="taxEntries">Tax Entries</TabsTrigger>
                        </TabsList>
                        <TabsContent value="items">
                            <ItemGrn items={initialValues?.items} />
                        </TabsContent>
                        <TabsContent value="extraCost">
                            <ExtraCost extraCost={initialValues?.extra_cost} />
                        </TabsContent>
                        <TabsContent value="stockMovement">
                            <StockMovement stockMovement={initialValues?.stock_movement} />
                        </TabsContent>
                        <TabsContent value="journalEntries">
                            <JournalEntries journalEntries={initialValues?.journal_entries} />
                        </TabsContent>
                        <TabsContent value="taxEntries">
                            <TaxEntries taxEntries={initialValues?.tax_entries} />
                        </TabsContent>
                    </Tabs>
                </Card>



                {openLog && (
                    <div className="w-1/4 transition-all duration-300 ease-in-out transform translate-x-0">
                        <div className="flex flex-col gap-4">
                            <CommentGrn />
                            <ActivityLog />
                        </div>
                    </div>
                )}
            </div>

            <Button
                aria-label={openLog ? "Close log panel" : "Open log panel"}
                onClick={handleOpenLog}
                variant="default"
                size="sm"
                className="fixed right-0 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-l-full rounded-r-none z-50 shadow-lg transition-all duration-300 hover:bg-primary/90 hover:translate-x-0 focus:outline-none focus:ring-2 focus:ring-primary"
                tabIndex={0}
            >
                {openLog ? (
                    <ChevronRight className="h-6 w-6 animate-pulse" />
                ) : (
                    <ChevronLeft className="h-6 w-6 animate-pulse" />
                )}
            </Button>
        </div>
    );
}

