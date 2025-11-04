"use client";

import { ClusterDtoId } from "@/dto/cluster.dto";
import FormCluster from "./FormCluster";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Kbd } from "@/components/ui/kbd";
import { ArrowLeftIcon, SquarePenIcon } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabBu from "./TabBu";
import TabUser from "./TabUser";

interface DetailClusterProps {
  cluster?: ClusterDtoId;
  mode: "add" | "edit" | "view";
}

export default function DetailCluster({ cluster, mode }: DetailClusterProps) {
  const router = useRouter();
  const [currentMode, setCurrentMode] = useState<"add" | "edit" | "view">(mode);

  return (
    <div className="max-w-4xl mx-auto p-2 space-y-2">
      {currentMode === "add" || currentMode === "edit" ? (
        <FormCluster mode={currentMode} setMode={setCurrentMode} />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Kbd
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => router.push("/cluster")}
              >
                <ArrowLeftIcon className="h-4 w-4" />
              </Kbd>
              <h1 className="text-2xl font-bold text-foreground">
                {cluster?.code} - {cluster?.name}
              </h1>
              <Badge variant="outline" className="gap-1.5 border-none">
                <span
                  className={cn(
                    cluster?.is_active ? "bg-green-500" : "bg-red-500",
                    "size-1.5 rounded-full"
                  )}
                  aria-hidden="true"
                />
                {cluster?.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button size={"sm"} onClick={() => setCurrentMode("edit")}>
                <SquarePenIcon />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-muted-foreground">{cluster?.info ?? "No information available"}</p>

            <Tabs defaultValue="business">
              <TabsList>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="users">User</TabsTrigger>
              </TabsList>
              <TabsContent value="business">
                <TabBu buData={cluster?.tb_business_unit ?? []} />
              </TabsContent>
              <TabsContent value="users">
                <TabUser userData={cluster?.tb_cluster_user ?? []} />
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
}
