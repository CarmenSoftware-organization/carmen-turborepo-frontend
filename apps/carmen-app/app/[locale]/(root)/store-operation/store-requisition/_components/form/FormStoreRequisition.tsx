"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formType } from "@/dtos/form.dto";
import { StoreRequisitionDetailDto, storeRequisitionDetailSchema } from "@/dtos/store-operation.dto";
import { ArrowLeftRightIcon, CheckCircleIcon, ChevronLeft, ChevronRight, Pencil, Printer, Save, X, XCircle, XCircleIcon } from "lucide-react";
import { useState } from "react";
import CommentStoreRequisition from "../CommentStoreRequisition";
import ActivityLogStoreRequisition from "../ActivityLogStoreRequisition";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "@/lib/navigation";
import { Badge } from "@/components/ui/badge";
import StoreRequisitionFormHeader from "./StoreRequisitionFormHeader";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import ItemStoreRequisition from "./ItemStoreRequisition";
import { mockJournalEntries, mockStockMovement, mockStoreRequisitionItems } from "@/mock-data/store-operation";
import StockMovement from "./StockMovement";
import SrJournalEntries from "./SrJournalEntries";
import TransactionSummary from "../TransactionSummary";

interface FormStoreRequisitionProps {
    readonly initData?: StoreRequisitionDetailDto;
    readonly mode: formType;
}

export default function FormStoreRequisition({ initData, mode }: FormStoreRequisitionProps) {
    const [openLog, setOpenLog] = useState<boolean>(false);
    const [currentMode, setCurrentMode] = useState<formType>(mode);
    const router = useRouter();

    const form = useForm<StoreRequisitionDetailDto>({
        resolver: zodResolver(storeRequisitionDetailSchema),
        defaultValues: {
            id: initData?.id,
            ref_no: initData?.ref_no,
            item_name: initData?.item_name,
            status: initData?.status,
            date: initData?.date,
            expected_delivery_date: initData?.expected_delivery_date,
            dp_req_from: initData?.dp_req_from,
            job_code: initData?.job_code,
            dp_req_to: initData?.dp_req_to,
            description: initData?.description
        }
    });

    const handleOpenLog = () => {
        setOpenLog(!openLog);
    };

    const onSubmit = (data: StoreRequisitionDetailDto) => {
        console.log(data);
        setCurrentMode(formType.VIEW);
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Edit button clicked, current mode:', currentMode);
        setCurrentMode(formType.EDIT);
    };

    const handleCancelClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (currentMode === formType.ADD || currentMode === formType.VIEW) {
            router.push("/store-operation/store-requisition");
        } else {
            setCurrentMode(formType.VIEW);
        }
    };

    console.log(initData);
    return (
        <div className="relative">
            <div className="flex gap-4 relative">
                <ScrollArea className={`${openLog ? 'w-3/4' : 'w-full'} transition-all duration-300 ease-in-out h-[calc(121vh-300px)]`}>
                    <Card className="p-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Link href="/store-operation/store-requisition">
                                            <ChevronLeft className="h-4 w-4" />
                                        </Link>
                                        <p className="text-lg font-bold">
                                            {mode === formType.ADD ? "Store Requisition" : `${initData?.item_name}`}
                                        </p>
                                        <Badge className="rounded-full">{initData?.status}</Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {currentMode === formType.VIEW ? (
                                            <>
                                                <Button variant="outline" size={'sm'} onClick={handleCancelClick}>
                                                    <ChevronLeft className="h-4 w-4" /> Back
                                                </Button>
                                                <Button variant="default" size={'sm'} onClick={handleEditClick}>
                                                    <Pencil className="h-4 w-4" /> Edit
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button variant="outline" size={'sm'} onClick={handleCancelClick}>
                                                    <X className="h-4 w-4" /> Cancel
                                                </Button>
                                                <Button
                                                    variant="default"
                                                    size={'sm'}
                                                    type="submit"
                                                >
                                                    <Save className="h-4 w-4" /> Save
                                                </Button>
                                            </>
                                        )}
                                        <Button type="button" variant="outline" size="sm">
                                            <Printer className="h-4 w-4" />
                                            Print
                                        </Button>
                                        <Button type="button" variant="outline" size="sm" className="text-destructive hover:text-destructive/80">
                                            <XCircle className="h-4 w-4" />
                                            Void
                                        </Button>
                                    </div>
                                </div>
                                <StoreRequisitionFormHeader control={form.control} mode={currentMode} />
                            </form>
                        </Form>
                    </Card>
                    <Tabs defaultValue="items" className="mt-2">
                        <TabsList>
                            <TabsTrigger value="items">Items</TabsTrigger>
                            <TabsTrigger value="stockMovement">Stock Movement</TabsTrigger>
                            <TabsTrigger value="journalEntries">Journal Entries</TabsTrigger>
                        </TabsList>
                        <TabsContent value="items">
                            <ItemStoreRequisition mode={currentMode} items={mockStoreRequisitionItems} />
                        </TabsContent>
                        <TabsContent value="stockMovement">
                            <StockMovement items={mockStockMovement} mode={currentMode} />
                        </TabsContent>
                        <TabsContent value="journalEntries">
                            <SrJournalEntries mode={currentMode} jeItems={mockJournalEntries} />
                        </TabsContent>
                    </Tabs>
                    <TransactionSummary />
                    <div className="fixed bottom-6 right-6 flex gap-2 z-50">
                        <Button
                            size={'sm'}
                        >
                            <CheckCircleIcon className="w-5 h-5" />
                            Approve
                        </Button>
                        <Button
                            variant={'destructive'}
                            size={'sm'}
                        >
                            <XCircleIcon className="w-5 h-5" />
                            Reject
                        </Button>
                        <Button
                            variant={'outline'}
                            size={'sm'}
                        >
                            <ArrowLeftRightIcon className="w-5 h-5" />
                            Send Back
                        </Button>
                    </div>
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




