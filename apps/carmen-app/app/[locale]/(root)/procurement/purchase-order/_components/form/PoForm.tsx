"use client";

import DetailsAndComments from "@/components/DetailsAndComments";
import { Card } from "@/components/ui/card";
import { formType } from "@/dtos/form.dto";
import { useTranslations } from "next-intl";
import { useState } from "react";
import ActionFields from "./ActionFields";
import HeadPoForm from "./HeadPoForm";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
import PoItems from "./PoItems";
import Grns from "./Grns";
import Docs from "./Docs";
import ActivityLog from "../ActivityLog";
import CommentPo from "../CommentPo";

import { PurchaseOrderDetailDto } from "@/dtos/procurement.dto";

interface PoFormProps {
  readonly poData: PurchaseOrderDetailDto;
  readonly mode: formType;
}

export default function PoForm({ poData, mode }: PoFormProps) {
  const tPurchaseOrder = useTranslations("PurchaseOrder");
  const [currentMode, setCurrentMode] = useState(mode);

  return (
    <DetailsAndComments activityComponent={<ActivityLog />} commentComponent={<CommentPo />}>
      <Card className="p-4 space-y-4 shadow-sm border-border/60">
        <ActionFields
          currentMode={currentMode}
          setCurrentMode={setCurrentMode}
          title={poData.po_number}
        />
        <HeadPoForm poData={poData} mode={currentMode} />
        <Tabs defaultValue="items">
          <TabsList className={"mt-4"}>
            <TabsTrigger className="w-full h-6" value="items">
              {tPurchaseOrder("items")}
            </TabsTrigger>
            <TabsTrigger className="w-full h-6" value="grn">
              {tPurchaseOrder("grn")}
            </TabsTrigger>
            <TabsTrigger className="w-full h-6" value="docs">
              {tPurchaseOrder("docs")}
            </TabsTrigger>
          </TabsList>
          <div className="mt-2">
            <TabsContent value="items" className="mt-0">
              <PoItems items={poData.items} />
            </TabsContent>
            <TabsContent value="grn" className="mt-0">
              <Grns grns={poData.grns} />
            </TabsContent>
            <TabsContent value="docs" className="mt-0">
              <Docs docs={poData.documents} />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </DetailsAndComments>
  );
}
