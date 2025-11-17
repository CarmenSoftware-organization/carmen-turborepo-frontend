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
    <ScrollArea className="h-full">
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
                  <div className="w-full flex items-center space-x-2 ml-4">
                    <label
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <Checkbox
                        checked={checkboxState.checked}
                        onCheckedChange={(checked) => {
                          console.log("[TreeView] Product checkbox changed:", data.id, checked);
                          handleCheckboxChange(data.id, checked === true);
                        }}
                      />
                    </label>
                    <p className="text-xs">
                      {data.name} - {data.local_name}
                    </p>
                    <Badge>{data.code}</Badge>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <label
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
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
                    </label>
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
