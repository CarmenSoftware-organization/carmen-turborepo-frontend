import { Button } from "@/components/ui/button";
import { CategoryNode } from "@/dtos/category.dto";
import { ChevronRight, Edit, FolderTree, Layers, Package, Plus, Trash } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const getIconColor = (type: CategoryNode["type"]) => {
    if (type === "category") return "text-primary";
    if (type === "subcategory") return "text-gray-500";
    return "text-emerald-500";
};

interface TreeNodeProps {
    readonly node: CategoryNode;
    readonly level?: number;
    readonly expanded: Record<string, boolean>;
    readonly toggleExpand: (id: string) => void;
    readonly onEdit: (node: CategoryNode) => void;
    readonly onAdd: (parentNode: CategoryNode) => void;
    readonly onDelete: (node: CategoryNode) => void;
}

export default function TreeNode({
    node,
    level = 0,
    expanded,
    toggleExpand,
    onEdit,
    onAdd,
    onDelete
}: TreeNodeProps) {
    const isExpanded = expanded[node.id] ?? false;
    const hasChildren = node.children && node.children.length > 0;

    // Determine icon based on node type
    let Icon = Layers
    if (node.type === "subcategory") Icon = FolderTree
    if (node.type === "itemGroup") Icon = Package

    return (
        <div className="tree-node">
            <div
                className={`flex items-center p-2 hover:bg-muted/50 rounded-md ${level > 0 ? "ml-6" : ""}`}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
            >
                {hasChildren ? (
                    <button onClick={() => toggleExpand(node.id)} className="mr-1 p-1 rounded-full hover:bg-muted">
                        <ChevronRight
                            className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""
                                }`}
                        />
                    </button>
                ) : (
                    <div className="w-6"></div>
                )}

                <Icon
                    className={`h-5 w-5 mr-2 ${getIconColor(node.type)}`}
                />

                <div className="flex-1">
                    <p className="text-xs font-medium">{node.name}</p>
                    <p className="text-xs text-muted-foreground">{node.description}</p>
                    {node.type === "itemGroup" && <p className="text-xs text-muted-foreground">{node.itemCount}</p>}
                </div>

                <div className="flex items-center gap-1">
                    {node.type !== "itemGroup" && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size={'sm'}
                                        onClick={() => onAdd(node)}
                                        className="h-6 w-6"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-background text-foreground">
                                    {node.type === "category" ? "Add to Sub category" : "Add to Item Group"}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                    )}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size={'sm'}
                                    onClick={() => onEdit(node)}
                                    className="h-6 w-6"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-background text-foreground">
                                {node.type === "category" ? "Edit Sub category" : "Edit Item Group"}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <Button
                        variant="ghost"
                        size={'sm'}
                        onClick={() => onDelete(node)}
                        className="text-destructive hover:text-destructive/80 h-6 w-6   "
                    >
                        <Trash className="h-4 w-4" />
                    </Button>



                </div>
            </div>

            {hasChildren && isExpanded && (
                <div className="children">
                    {node.children?.map((child) => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            level={level + 1}
                            expanded={expanded}
                            toggleExpand={toggleExpand}
                            onEdit={onEdit}
                            onAdd={onAdd}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
