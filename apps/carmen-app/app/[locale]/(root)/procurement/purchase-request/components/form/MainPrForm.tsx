"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formType } from "@/dtos/form.dto";
import { ItemPrDetailDto, PurchaseRequestByIdDto, PurchaseRequestFormDto, purchaseRequestFormSchema } from "@/dtos/pr.dto";
import { Link, useRouter } from "@/lib/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookmarkIcon, ChevronLeft, ChevronRight, FileDown, Pencil, Printer, Save, ShareIcon, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import HeadPrForm from "./HeadPrForm";
import { Card } from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import ItemPr from "./ItemPr";
import WorkflowPr from "./WorkflowPr";
import ItemPrDialog from "./ItemPrDialog";

interface MainPrFormProps {
    readonly mode: formType;
    readonly initValues?: PurchaseRequestByIdDto;
    readonly docType?: string;
}
export default function MainPrForm({ mode, initValues, docType }: MainPrFormProps) {
    const router = useRouter();
    const [openLog, setOpenLog] = useState<boolean>(false);
    const [currentMode, setCurrentMode] = useState<formType>(mode);
    const [openDialogItemPr, setOpenDialogItemPr] = useState<boolean>(false);
    const [currentItemData, setCurrentItemData] = useState<ItemPrDetailDto | undefined>(undefined);
    const [currentItems, setCurrentItems] = useState<ItemPrDetailDto[]>(initValues?.purchase_request_detail || []);

    // Reset current items when initValues changes
    useEffect(() => {
        if (initValues?.purchase_request_detail) {
            setCurrentItems(initValues.purchase_request_detail);
        }
    }, [initValues?.purchase_request_detail]);

    const defaultValues: Partial<PurchaseRequestFormDto> = {
        pr_date: initValues?.pr_date ?? new Date().toISOString(),
        pr_status: initValues?.pr_status ?? "",
        requestor_id: initValues?.requestor_id ?? "",
        requestor_name: undefined, // จะถูกเติมจาก backend หรือดึงจาก ID
        department_id: initValues?.department_id ?? "",
        department_name: undefined, // จะถูกเติมจาก backend หรือดึงจาก ID
        is_active: initValues?.is_active ?? true,
        doc_version: initValues?.doc_version ?? "",
        note: initValues?.note ?? "",
        description: initValues?.description ?? "",
        info: {
            priority: initValues?.info?.priority ?? "",
            budget_code: initValues?.info?.budget_code ?? "",
        },
        dimension: {
            cost_center: initValues?.dimension?.cost_center ?? "",
            project: initValues?.dimension?.project ?? "",
        },
        purchase_request_detail: {
            ...initValues?.purchase_request_detail?.map(item => ({
                ...item,
                id: (item as { id?: string }).id
            })) ?? [],
            add: [],
            update: [],
            delete: []
        },
    };

    const form = useForm<PurchaseRequestFormDto>({
        resolver: zodResolver(purchaseRequestFormSchema),
        defaultValues,
        mode: "onChange"
    })

    // Log when form state changes to help debug
    useEffect(() => {
        console.log("Form state updated:", {
            isDirty: form.formState.isDirty,
            isValid: form.formState.isValid,
            errors: form.formState.errors
        });
    }, [form.formState]);

    const onSubmit = (data: PurchaseRequestFormDto) => {
        console.log("onSubmit function called with data:", data);

        try {
            // Validate that we have all necessary data
            if (currentItems.length === 0) {
                alert("Please add at least one item to the purchase request.");
                return;
            }

            // Get current items from state - this is what we're showing in the UI
            const updatedItems = [...currentItems];

            // Prepare data for API submission
            const finalData = {
                ...data,
                purchase_request_detail: {
                    add: data.purchase_request_detail.add || [],
                    update: data.purchase_request_detail.update || [],
                    delete: data.purchase_request_detail.delete || []
                }
            };

            console.log("==================== FORM SUBMITTED ====================");
            console.log("Data for API call:", finalData);
            console.log("Current items in UI:", updatedItems);
            console.log("Items to add:", data.purchase_request_detail.add);
            console.log("Items to update:", data.purchase_request_detail.update);
            console.log("Items to delete:", data.purchase_request_detail.delete);
            console.log("Form values:", form.getValues());
            console.log("Current mode:", currentMode);
            console.log("=======================================================");

            // Here you would typically send the data to your API
            // Example: sendDataToApi(finalData)
            //     .then(() => {
            //         alert("Form submitted successfully!");
            //         setCurrentMode(formType.VIEW);
            //     })
            //     .catch(error => {
            //         console.error("Error submitting form:", error);
            //         alert("Error submitting form");
            //     });

            // For now, just show an alert and switch to view mode
            alert("Form submitted successfully! Check console for details.");
            setCurrentMode(formType.VIEW);
        } catch (error) {
            console.error("Error in form submission:", error);
            alert("Error submitting form. See console for details.");
        }
    }

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
            router.push("/procurement/purchase-request");
        } else {
            setCurrentMode(formType.VIEW);
        }
    };


    const handleOpenLog = () => {
        setOpenLog(!openLog);
    };

    const handleDialogItemPr = (e: React.MouseEvent, data: ItemPrDetailDto) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Handling dialog for item:', data);

        // Deep clone the data to avoid reference issues
        const itemData = JSON.parse(JSON.stringify(data));

        // Ensure all required fields have values
        if (!itemData.dimension) {
            itemData.dimension = { project: '', cost_center: '' };
        }

        // Store the data for view mode and dialog
        setCurrentItemData(itemData);

        // For new items without an ID, add a temp ID and add to the currentItems
        if (!itemData.id && currentMode !== formType.VIEW) {
            // Generate a temporary unique ID for tracking
            const tempId = `temp-${Date.now()}`;
            itemData.id = tempId;

            // Don't add to the form yet - we'll do that when the user saves
            // But we can add it to the current items for immediate visibility in UI
            if (!currentItems.some(item => item.id === tempId)) {
                setCurrentItems([...currentItems, itemData]);
            }
        }

        setOpenDialogItemPr(true);
    }

    // Handle saving item data from dialog
    const handleSaveItemDialog = (itemData: ItemPrDetailDto) => {
        console.log('Saving item data:', itemData);
        const formItems = form.getValues("purchase_request_detail");

        // For UI update - maintain a separate list of current items
        let updatedItemsList = [...currentItems];

        if (itemData.id?.startsWith('temp-')) {
            // New item - remove temp id and add to add array
            console.log('Adding new item', itemData);

            // For new items, create a copy without the temp ID to match API expectations
            const newItem = { ...itemData };
            // Remove the temp ID for API but keep it for UI
            delete newItem.id; // Remove the temp ID

            const updatedItems = {
                ...formItems,
                add: [...(formItems.add || []), newItem]
            };
            form.setValue("purchase_request_detail", updatedItems);

            // Add to UI list with temp ID intact
            updatedItemsList.push({ ...itemData });
        } else if (itemData.id) {
            // Update existing item - add to update array
            console.log('Updating item', itemData);

            const updatedItems = {
                ...formItems,
                update: [...(formItems.update || []).filter(item => item.id !== itemData.id), itemData]
            };
            form.setValue("purchase_request_detail", updatedItems);

            // Update in UI list
            updatedItemsList = updatedItemsList.map(item =>
                item.id === itemData.id ? { ...item, ...itemData } : item
            );
        }

        // Update UI list
        setCurrentItems(updatedItemsList);

        // Close dialog and clean up
        setOpenDialogItemPr(false);
    };

    // Function to handle dialog close
    const handleCloseDialog = (open: boolean) => {
        setOpenDialogItemPr(open);
        if (!open) {
            // Only clear the item data when dialog is closed
            setTimeout(() => {
                setCurrentItemData(undefined);
            }, 100);
        }
    };

    // Handle deleting an item
    const handleDeleteItem = (itemId: string) => {
        const formItems = form.getValues("purchase_request_detail");

        // Add to delete array if it's an existing item
        const updatedItems = {
            ...formItems,
            delete: [...(formItems.delete || []), itemId]
        };

        form.setValue("purchase_request_detail", updatedItems);

        // Remove from UI list
        setCurrentItems(currentItems.filter(item => item.id !== itemId));
    };

    return (
        <div className="relative">
            <div className="flex gap-4 relative">
                <ScrollArea className={`${openLog ? 'w-3/4' : 'w-full'} transition-all duration-300 ease-in-out h-[calc(121vh-300px)]`}>
                    <Card className="p-4 mb-4">
                        <Form {...form}>
                            <form
                                className="space-y-4"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    console.log("Form submit event triggered");
                                    form.handleSubmit((data) => {
                                        console.log("Form handle submit callback triggered");
                                        onSubmit(data);
                                    })();
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Link href="/procurement/purchase-request">
                                            <ChevronLeft className="h-4 w-4" />
                                        </Link>
                                        <p className="text-lg font-bold">Purchase Request</p>

                                        {mode !== formType.ADD && (
                                            <Badge className="rounded-full">{initValues?.pr_status}</Badge>
                                        )}
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
                                                    type="button"
                                                    onClick={() => {
                                                        console.log("Save button clicked");
                                                        // Manually trigger form submission
                                                        form.handleSubmit((data) => {
                                                            console.log("Form submission started");
                                                            onSubmit(data);
                                                        })();
                                                    }}
                                                >
                                                    <Save className="h-4 w-4" /> Save
                                                </Button>
                                            </>
                                        )}
                                        <Button variant={'outline'} size={'sm'}>
                                            <Printer className="w-4 h-4" />
                                            Print
                                        </Button>
                                        <Button variant={'outline'} size={'sm'}>
                                            <FileDown className="h-4 w-4" />
                                            Export
                                        </Button>
                                        <Button variant={'outline'} size={'sm'}>
                                            <ShareIcon className="w-4 h-4" />
                                            Share
                                        </Button>
                                        <Button variant={'outline'} size={'sm'}>
                                            <BookmarkIcon className="w-4 h-4" />
                                            Save as Template
                                        </Button>
                                    </div>
                                </div>
                                <HeadPrForm
                                    control={form.control}
                                    mode={currentMode}
                                    prNo={initValues?.pr_no}
                                />
                                <Tabs defaultValue="items">
                                    <TabsList className="w-full">
                                        <TabsTrigger className="w-full" value="items">Items</TabsTrigger>
                                        <TabsTrigger className="w-full" value="budgets">Budgets</TabsTrigger>
                                        <TabsTrigger className="w-full" value="workflow">Workflow</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="items">
                                        <ItemPr
                                            itemsPr={currentItems.filter(item =>
                                                !form.getValues().purchase_request_detail.delete?.includes(item.id || "")
                                            )}
                                            mode={currentMode}
                                            openDetail={handleDialogItemPr}
                                            onDeleteItem={handleDeleteItem}
                                        />
                                    </TabsContent>
                                    <TabsContent value="budgets">
                                        Budgets
                                    </TabsContent>
                                    <TabsContent value="workflow">
                                        <WorkflowPr
                                            workflowData={initValues?.workflow_history}
                                        />
                                    </TabsContent>
                                </Tabs>
                            </form>
                        </Form>
                    </Card>
                    <h1>Mode {mode}</h1>
                    <h1>Doc Type {docType}</h1>
                    {initValues && <pre>{JSON.stringify(initValues.purchase_request_detail, null, 2)}</pre>}
                </ScrollArea>

                {openLog && (
                    <div className="w-1/4 transition-all duration-300 ease-in-out transform translate-x-0">
                        <div className="flex flex-col gap-4">
                            <h1>Log</h1>
                            <h1>Activity Log</h1>
                        </div>
                    </div>
                )}
                <ItemPrDialog
                    open={openDialogItemPr}
                    onOpenChange={handleCloseDialog}
                    isLoading={false}
                    mode={currentMode}
                    formValues={currentItemData}
                    onSave={handleSaveItemDialog}
                />
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
