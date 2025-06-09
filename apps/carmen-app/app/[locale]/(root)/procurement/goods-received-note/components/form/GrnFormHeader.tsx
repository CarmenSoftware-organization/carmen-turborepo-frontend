"use client";

import { Control } from "react-hook-form";
import { FileText, Package, Store, Coins, FileType, GitBranch, Clock, CheckCircle, Image, CreditCard, AlignLeft, MessageSquare } from "lucide-react";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formType } from "@/dtos/form.dto";
import { CreateGRNDto } from "@/dtos/grn.dto";
import VendorLookup from "@/components/lookup/VendorLookup";
import { useVendor } from "@/hooks/useVendor";
import { useCurrency } from "@/hooks/useCurrency";
import CurrencyLookup from "@/components/lookup/CurrencyLookup";
import { DOC_TYPE } from "@/constants/enum";
import { useCreditTermQuery } from "@/hooks/useCreditTerm";
import CreditTermLookup from "@/components/lookup/CreditTermLookup";
import WorkflowLookup from "@/components/lookup/WorkflowLookup";
import { enum_workflow_type } from "@/dtos/workflows.dto";
import { useWorkflow } from "@/hooks/useWorkflow";

interface GrnFormHeaderProps {
    readonly control: Control<CreateGRNDto>;
    readonly mode: formType;
    readonly token: string;
    readonly tenantId: string;
}

export default function GrnFormHeader({ control, mode, token, tenantId }: GrnFormHeaderProps) {
    const { getVendorName } = useVendor();
    const { getCurrencyCode } = useCurrency();
    const { getCreditTermName } = useCreditTermQuery(token, tenantId);
    const { getWorkflowName } = useWorkflow();

    return (
        <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                {/* GRN Number */}

                {mode !== formType.ADD && (
                    <FormField
                        control={control}
                        name="grn_no"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <div className="flex items-center gap-1">
                                        <FileText className="h-3 w-3" />
                                        GRN Number
                                    </div>
                                </FormLabel>
                                {mode === formType.VIEW ? (
                                    <p className="text-xs text-muted-foreground">{field.value}</p>
                                ) : (
                                    <FormControl>
                                        <Input {...field} value={field.value} disabled />
                                    </FormControl>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}


                {/* Name */}
                <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                <div className="flex items-center gap-1">
                                    <Package className="h-3 w-3" />
                                    Name
                                </div>
                            </FormLabel>
                            {mode === formType.VIEW ? (
                                <p className="text-xs text-muted-foreground">{field.value}</p>
                            ) : (
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Vendor ID */}
                <FormField
                    control={control}
                    name="vendor_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                <div className="flex items-center gap-1">
                                    <Store className="h-3 w-3" />
                                    Vendor
                                </div>
                            </FormLabel>
                            {mode === formType.VIEW ? (
                                <p className="text-xs text-muted-foreground">{getVendorName(field.value)}</p>
                            ) : (
                                <FormControl>
                                    <VendorLookup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    />
                                </FormControl>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Currency ID */}
                <FormField
                    control={control}
                    name="currency_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                <div className="flex items-center gap-1">
                                    <Coins className="h-3 w-3" />
                                    Currency
                                </div>
                            </FormLabel>
                            {mode === formType.VIEW ? (
                                <p className="text-xs text-muted-foreground">{getCurrencyCode(field.value)}</p>
                            ) : (
                                <FormControl>
                                    <CurrencyLookup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    />
                                </FormControl>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Doc Type */}
                <FormField
                    control={control}
                    name="doc_type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                <div className="flex items-center gap-1">
                                    <FileType className="h-3 w-3" />
                                    Document Type
                                </div>
                            </FormLabel>
                            {mode === formType.VIEW ? (
                                <p className="text-xs text-muted-foreground">{field.value}</p>
                            ) : (
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select document type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value={DOC_TYPE.MANUAL}>Mannual</SelectItem>
                                        <SelectItem value={DOC_TYPE.PURCHASE_ORDER}>Purchase Order</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Workflow ID */}
                <FormField
                    control={control}
                    name="workflow_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                <div className="flex items-center gap-1">
                                    <GitBranch className="h-3 w-3" />
                                    Workflow
                                </div>
                            </FormLabel>
                            {mode === formType.VIEW ? (
                                <p className="text-xs text-muted-foreground">{getWorkflowName(field.value)}</p>
                            ) : (
                                <FormControl>
                                    <WorkflowLookup
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        type={enum_workflow_type.goods_received_note}
                                    />
                                </FormControl>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Credit Term ID */}
                <FormField
                    control={control}
                    name="credit_term_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Credit Term
                                </div>
                            </FormLabel>
                            {mode === formType.VIEW ? (
                                <p className="text-xs text-muted-foreground">{getCreditTermName(field.value)}</p>
                            ) : (
                                <FormControl>
                                    <CreditTermLookup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    />
                                </FormControl>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="current_workflow_status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                <div className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    Workflow Status
                                </div>
                            </FormLabel>
                            {mode === formType.VIEW ? (
                                <p className="text-xs text-muted-foreground">{field.value}</p>
                            ) : (
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Signature Image URL */}
                <FormField
                    control={control}
                    name="signature_image_url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                <div className="flex items-center gap-1">
                                    <Image className="h-3 w-3" />
                                    Signature Image URL
                                </div>
                            </FormLabel>
                            {mode === formType.VIEW ? (
                                <p className="text-xs text-muted-foreground">{field.value}</p>
                            ) : (
                                <FormControl>
                                    <Input {...field} placeholder="Image URL" />
                                </FormControl>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="mt-2 flex flex-col gap-2">
                <FormLabel>
                    <div className="flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        Payment Methods
                    </div>
                </FormLabel>
                <div className="flex flex-row gap-6">
                    <FormField
                        control={control}
                        name="is_consignment"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2">
                                <FormLabel className="cursor-pointer font-normal">
                                    Consignment
                                </FormLabel>
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={(checked: boolean | "indeterminate") => {
                                            field.onChange(!!checked);
                                        }}
                                        disabled={mode === formType.VIEW}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="is_cash"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2">
                                <FormLabel className="cursor-pointer font-normal">
                                    Cash
                                </FormLabel>
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={(checked: boolean | "indeterminate") => {
                                            field.onChange(!!checked);
                                        }}
                                        disabled={mode === formType.VIEW}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="is_active"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2">
                                <FormLabel className="cursor-pointer font-normal">
                                    Active
                                </FormLabel>
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={(checked: boolean | "indeterminate") => {
                                            field.onChange(!!checked);
                                        }}
                                        disabled={mode === formType.VIEW}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            {/* Description */}
            <FormField
                control={control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            <div className="flex items-center gap-1">
                                <AlignLeft className="h-3 w-3" />
                                Description
                            </div>
                        </FormLabel>
                        {mode === formType.VIEW ? (
                            <p className="text-xs text-muted-foreground">{field.value}</p>
                        ) : (
                            <FormControl>
                                <Textarea {...field} />
                            </FormControl>
                        )}
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Note */}
            <FormField
                control={control}
                name="note"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            <div className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                Note
                            </div>
                        </FormLabel>
                        {mode === formType.VIEW ? (
                            <p className="text-xs text-muted-foreground">{field.value}</p>
                        ) : (
                            <FormControl>
                                <Textarea {...field} />
                            </FormControl>
                        )}
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}

