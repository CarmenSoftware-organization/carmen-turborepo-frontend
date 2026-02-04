import { Tree as TreeStructure, TreeItem, TreeItemLabel } from "@/components/ui/tree";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { TreeInstance, ItemInstance } from "@headless-tree/core";
import { TreeNodeData } from "./types";

interface ProductTreeMoqViewProps {
  readonly tree: TreeInstance<TreeNodeData>;
  readonly getCheckboxState: (itemId: string) => { checked: boolean; indeterminate: boolean };
  readonly handleCheckboxChange: (itemId: string, checked: boolean) => void;
}

export function ProductTreeMoqView({
  tree,
  getCheckboxState,
  handleCheckboxChange,
}: ProductTreeMoqViewProps) {
  const allItems = tree.getItems();

  return (
    <div className="border rounded-md p-4 flex flex-col h-full">
      <h3 className="font-semibold mb-4 text-xs">Product Tree (MOQ)</h3>
      <ScrollArea className="max-h-[calc(100vh-250px)]">
        <TreeStructure tree={tree} indent={24} toggleIconType="chevron" className="pr-4">
          {allItems.map((item: ItemInstance<TreeNodeData>) => {
            const data = item.getItemData();
            if (!data.name) return null;
            const checkboxState = getCheckboxState(data.id);

            return (
              <TreeItem key={item.getId()} item={item} asChild>
                <div className="w-full cursor-pointer">
                  <TreeItemLabel>
                    {data.type === "product" ? (
                      <div className="flex items-center space-x-2 ml-4 w-full">
                        <div
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <Checkbox
                            checked={checkboxState.checked}
                            onCheckedChange={(checked) => {
                              handleCheckboxChange(data.id, checked === true);
                            }}
                          />
                        </div>
                        <p className="text-xs">
                          {data.name} {data.local_name ? `- ${data.local_name}` : ""}
                        </p>
                        <Badge variant="product_badge">{data.code}</Badge>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 w-full">
                        <div
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
                              handleCheckboxChange(data.id, checked === true);
                            }}
                          />
                        </div>
                        <p className="text-xs font-medium">{data.name}</p>
                        <Badge variant="product_badge">{data.children?.length || 0}</Badge>
                      </div>
                    )}
                  </TreeItemLabel>
                </div>
              </TreeItem>
            );
          })}
        </TreeStructure>
      </ScrollArea>
    </div>
  );
}
