import { formType } from "@/dtos/form.dto";
import { prFormSchema, PurchaseRequestDto } from "@/dtos/procurement.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useRouter } from "@/lib/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TAB_PR } from "@/constants/tabs";
import ItemPr from "./ItemPr";
import BudgetPr from "./BudgetPr";
import WorkflowPr from "./WorkflowPr";
import AttachmentPr from "./AttachmentPr";
import ActivityPr from "./ActivityPr";
import TransactionSummary from "./TransactionSummary";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeftRightIcon, BookmarkIcon, CheckCircleIcon, FileDown, Printer, SaveIcon, ShareIcon, XCircleIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
interface PrFormProps {
    readonly mode: formType;
    readonly initValues?: PurchaseRequestDto;
}

export default function PrForm({ mode, initValues }: PrFormProps) {
    const router = useRouter();

    const form = useForm<PurchaseRequestDto>({
        resolver: zodResolver(prFormSchema),
        defaultValues: initValues || {
            title: "",
            type: "",
            description: "",
            requestor: "",
            department: "",
            amount: 0,
        },
    });

    const handleSubmit = (data: PurchaseRequestDto) => {
        console.log(data);
    };

    return (
        <Card className="w-full p-4 space-y-4">
            <ScrollArea className="h-[calc(110vh-200px)]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold">
                                {mode === formType.ADD ? "Create Purchase Request" : "Edit Purchase Request"}
                            </h1>
                            <div className="flex justify-end gap-2">
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
                                <Button
                                    size={'sm'}
                                    variant="outline"
                                    type="button"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" size={'sm'}>
                                    <SaveIcon className="w-4 h-4" />
                                    {mode === formType.ADD ? "Save" : "Update"}
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter type" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="requestor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Requestor</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter requestor" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="department"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Department</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter department" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Enter amount"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-2">
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="w-1/2">
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter description"
                                                className="resize-none min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="w-1/2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 bg-muted p-2 rounded-md">
                                <div className="flex flex-col items-center justify-center space-y-2">
                                    <p className="text-sm font-medium">Current Workflow Stage</p>
                                    <Badge className="bg-green-100 text-green-800">
                                        <CheckCircleIcon className="w-4 h-4" />
                                        Requestor
                                    </Badge>

                                </div>
                                <div className="flex flex-col items-center justify-center space-y-2">
                                    <p className="text-sm font-medium">Workflow Status</p>
                                    <Badge className="bg-yellow-100 text-yellow-800">
                                        <CheckCircleIcon className="w-4 h-4" />
                                        Pending
                                    </Badge>
                                </div>
                                <div className="flex flex-col items-center justify-center space-y-2">
                                    <p className="text-sm font-medium">Status</p>
                                    <Badge className="bg-blue-100 text-blue-800">
                                        <CheckCircleIcon className="w-4 h-4" />
                                        Approved
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </form>
                </Form>

                <Tabs defaultValue={TAB_PR.ITEM}>
                    <TabsList className="w-full mt-4">
                        <TabsTrigger value={TAB_PR.ITEM} className="w-full">Items</TabsTrigger>
                        <TabsTrigger value={TAB_PR.BUDGET} className="w-full">Budget</TabsTrigger>
                        <TabsTrigger value={TAB_PR.WORKFLOW} className="w-full">Workflow</TabsTrigger>
                        <TabsTrigger value={TAB_PR.ATTACHMENT} className="w-full">Attachments</TabsTrigger>
                        <TabsTrigger value={TAB_PR.ACTIVITY} className="w-full">Activity</TabsTrigger>
                    </TabsList>
                    <TabsContent value={TAB_PR.ITEM}>
                        <ItemPr />
                    </TabsContent>
                    <TabsContent value={TAB_PR.BUDGET}>
                        <BudgetPr />
                    </TabsContent>
                    <TabsContent value={TAB_PR.WORKFLOW}>
                        <WorkflowPr />
                    </TabsContent>
                    <TabsContent value={TAB_PR.ATTACHMENT}>
                        <AttachmentPr />
                    </TabsContent>
                    <TabsContent value={TAB_PR.ACTIVITY}>
                        <ActivityPr />
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
        </Card>
    );
}
