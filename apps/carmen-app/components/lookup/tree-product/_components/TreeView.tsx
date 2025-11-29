"use client";

import { Tree as TreeStructure, TreeItem, TreeItemLabel } from "@/components/ui/tree";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TreeInstance, ItemInstance } from "@headless-tree/core";
import { TreeNodeData } from "../types";

interface TreeViewProps {
  readonly tree: TreeInstance<TreeNodeData>;
  readonly getCheckboxState: (itemId: string) => { checked: boolean; indeterminate: boolean };
  readonly handleCheckboxChange: (itemId: string, checked: boolean) => void;
}

export function TreeView({ tree, getCheckboxState, handleCheckboxChange }: TreeViewProps) {
  const allItems = tree.getItems();

  return (
    <ScrollArea className="flex-1 max-h-[calc(80vh-250px)]">
      <TreeStructure tree={tree} indent={24} toggleIconType="chevron" className="pr-4">
        {allItems.map((item: ItemInstance<TreeNodeData>) => {
          const data = item.getItemData();
          if (!data.name) {
            return null;
          }
          const checkboxState = getCheckboxState(data.id);

          return (
            <TreeItem key={item.getId()} item={item}>
              <TreeItemLabel>
                {data.type === "product" ? (
                  <div className="w-full flex items-start space-x-2 text-left">
                    <div
                      className="cursor-pointer mt-0.5"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                      role="none"
                    >
                      <Checkbox
                        checked={checkboxState.checked}
                        onCheckedChange={(checked) => {
                          console.log("[TreeView] Product checkbox changed:", data.id, checked);
                          handleCheckboxChange(data.id, checked === true);
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span>
                        {data.name} - {data.local_name}{" "}
                        <Badge variant={"product_badge"}>{data.code}</Badge>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                      role="none"
                    >
                      <Checkbox
                        checked={
                          checkboxState.indeterminate ? "indeterminate" : checkboxState.checked
                        }
                        onCheckedChange={(checked) => {
                          console.log("[TreeView] Category checkbox changed:", data.id, checked);
                          handleCheckboxChange(data.id, checked === true);
                        }}
                      />
                    </div>
                    <p className="text-xs">{data.name}</p>
                    <Badge variant="secondary">{data.children?.length || 0}</Badge>
                  </div>
                )}
              </TreeItemLabel>
            </TreeItem>
          );
        })}
      </TreeStructure>
    </ScrollArea>
  );
}
