/* eslint-disable react/react-in-jsx-scope */
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkflowList from "./_components/WorkflowList";
import { WorkflowTemplates } from "./_components/WorkflowTemplates";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function WorkflowConfigurationPage() {
  return (
    <Suspense>
      <WorkflowConfigurationContent />
    </Suspense>
  );
}

function WorkflowConfigurationContent() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "workflow";

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Workflow Management</h1>
      <Tabs defaultValue={defaultTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="templates">Notification Templates</TabsTrigger>
        </TabsList>
        <TabsContent value="workflow">
          <WorkflowList />
        </TabsContent>
        <TabsContent value="templates">
          <WorkflowTemplates />
        </TabsContent>
      </Tabs>
    </div>
  );
}
