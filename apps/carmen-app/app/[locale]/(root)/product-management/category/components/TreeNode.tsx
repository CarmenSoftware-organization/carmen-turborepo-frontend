import { Button } from "@/components/ui/button";
import { CategoryNode } from "@/dtos/category.dto";
import { ChevronRight, Edit, FolderTree, Layers, Package, Plus, Trash, Trash2 } from "lucide-react";

const getIconColor = (type: CategoryNode["type"]) => {
    if (type === "category") return "";
    if (type === "subcategory") return "text-blue-500";
    return "text-green-500";
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
                    className={`h-4 w-4 mr-2 ${getIconColor(node.type)}`}
                />

                <div className="flex-1">
                    <div className="font-medium">{node.name}</div>
                    <div className="text-xs text-muted-foreground">{node.description}</div>
                    {node.type === "itemGroup" && <div className="text-xs text-muted-foreground">{node.itemCount}</div>}
                </div>

                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        size={'sm'}
                        onClick={() => onEdit(node)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size={'sm'}
                        onClick={() => onDelete(node)}
                        className="text-destructive hover:text-destructive/80"
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                    {node.type !== "itemGroup" && (
                        <Button
                            variant="ghost"
                            size={'sm'}
                            onClick={() => onAdd(node)}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    )}
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
