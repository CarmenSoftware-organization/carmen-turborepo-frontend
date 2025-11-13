import { Tree as TreeStructure, TreeItem, TreeItemLabel } from "@/components/ui/tree";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
    <TreeStructure tree={tree} indent={24} toggleIconType="chevron" className="overflow-auto">
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
                <div className="w-full">
                  <div className="flex items-center space-x-2 ml-4">
                    <Checkbox
                      checked={checkboxState.checked}
                      onCheckedChange={(checked) => {
                        handleCheckboxChange(data.id, checked === true);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <p className="text-xs">
                      {data.name} - {data.local_name}
                    </p>
                    <Badge>{data.code}</Badge>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={checkboxState.indeterminate ? "indeterminate" : checkboxState.checked}
                    onCheckedChange={(checked) => {
                      handleCheckboxChange(data.id, checked === true);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <p className="text-xs">{data.name}</p>
                  <Badge variant="secondary">{data.children?.length || 0}</Badge>
                </div>
              )}
            </TreeItemLabel>
          </TreeItem>
        );
      })}
    </TreeStructure>
  );
}
