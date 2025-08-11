"use client";

import DetailsAndComments from "@/components/DetailsAndComments";
import { formType } from "@/dtos/form.dto";
import { useTranslations } from "next-intl";
import { useState } from "react";
import ActivityLog from "../ActivityLog";
import CommentPrt from "../CommentPrt";
import { Card } from "@/components/ui/card";
import ActionFields from "./ActionFields";
import HeadPrtForm from "./HeadPrtForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Items from "./Items";

interface PrtFormProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly prtData?: any;
    readonly mode: formType;
}

export default function PrtForm({ prtData, mode }: PrtFormProps) {
    const tPurchaseRequest = useTranslations("PurchaseRequest");
    const [currentMode, setCurrentMode] = useState<formType>(mode);

    return (
        <DetailsAndComments
            activityComponent={<ActivityLog />}
            commentComponent={<CommentPrt />}
        >
            <Card className="p-4 space-y-4">
                <ActionFields
                    currentMode={currentMode}
                    setCurrentMode={setCurrentMode}
                    title={prtData?.data?.pr_no}
                />
                <HeadPrtForm prtData={prtData?.data} />
                <Tabs defaultValue="items">
                    <TabsList className="w-full">
                        <TabsTrigger className="w-full" value="items">
                            {tPurchaseRequest("items")}
                        </TabsTrigger>
                        <TabsTrigger
                            className="w-full"
                            value="budget"
                        >
                            {tPurchaseRequest("budget")}
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="items">
                        <Items items={prtData?.data?.purchase_request_detail} />
                    </TabsContent>
                    <TabsContent value="budget">
                        <h1>Budget</h1>
                    </TabsContent>
                </Tabs>
            </Card>
            {/* <pre>{JSON.stringify(prtData, null, 2)}</pre> */}
        </DetailsAndComments>
    )
}