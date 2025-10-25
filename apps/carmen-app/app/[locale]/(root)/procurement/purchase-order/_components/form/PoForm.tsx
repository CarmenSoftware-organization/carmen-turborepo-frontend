"use client";

import DetailsAndComments from "@/components/DetailsAndComments";
import { Card } from "@/components/ui/card";
import { formType } from "@/dtos/form.dto";
import { useTranslations } from "next-intl";
import { useState } from "react";
import ActionFields from "./ActionFields";
import HeadPoForm from "./HeadPoForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PoItems from "./PoItems";
import Grns from "./Grns";
import Docs from "./Docs";
import ActivityLog from "../ActivityLog";
import CommentPo from "../CommentPo";

interface PoFormProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly poData: any;
    readonly mode: formType;
}

export default function PoForm({ poData, mode }: PoFormProps) {
    const tPurchaseOrder = useTranslations("PurchaseOrder");
    const [currentMode, setCurrentMode] = useState(mode);

    return (
        <DetailsAndComments
            activityComponent={<ActivityLog />}
            commentComponent={<CommentPo />}
        >
            <Card className="p-4 space-y-4">
                <ActionFields
                    currentMode={currentMode}
                    setCurrentMode={setCurrentMode}
                    title={poData.po_number}
                />
                <HeadPoForm poData={poData} />
                <Tabs defaultValue="items">
                    <TabsList className="w-full">
                        <TabsTrigger className="w-full" value="items">
                            {tPurchaseOrder("items")}
                        </TabsTrigger>
                        <TabsTrigger
                            className="w-full"
                            value="grn"
                        >
                            {tPurchaseOrder("grn")}
                        </TabsTrigger>
                        <TabsTrigger
                            className="w-full"
                            value="docs"
                        >
                            {tPurchaseOrder("docs")}
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="items">
                        <PoItems items={poData.items} />
                    </TabsContent>
                    <TabsContent value="grn">
                        <Grns grns={poData.grns} />
                    </TabsContent>
                    <TabsContent value="docs">
                        <Docs docs={poData.documents} />
                    </TabsContent>
                </Tabs>
            </Card>
        </DetailsAndComments>
    )
}