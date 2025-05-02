"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formType } from "@/dtos/form.dto";
import { StoreRequisitionDto } from "@/dtos/store-operation.dto";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import CommentStoreRequisition from "../CommentStoreRequisition";
import ActivityLogStoreRequisition from "../ActivityLogStoreRequisition";

interface FormStoreRequisitionProps {
    readonly initData?: StoreRequisitionDto;
    readonly mode: formType;
}

export default function FormStoreRequisition({ initData, mode }: FormStoreRequisitionProps) {
    const [openLog, setOpenLog] = useState<boolean>(false);

    const handleOpenLog = () => {
        setOpenLog(!openLog);
    };

    return (
        <div className="relative">
            <div className="flex gap-4 relative">
                <ScrollArea className={`${openLog ? 'w-3/4' : 'w-full'} transition-all duration-300 ease-in-out h-[calc(121vh-300px)]`}>
                    <Card className="p-4">

                    </Card>
                </ScrollArea>
                {openLog && (
                    <div className="w-1/4 transition-all duration-300 ease-in-out transform translate-x-0">
                        <div className="flex flex-col gap-4">
                            <CommentStoreRequisition />
                            <ActivityLogStoreRequisition />
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
    )
}




