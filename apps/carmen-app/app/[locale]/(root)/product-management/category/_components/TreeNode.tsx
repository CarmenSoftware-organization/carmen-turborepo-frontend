import { Button } from "@/components/ui/button";
import { CategoryNode, NODE_TYPE } from "@/dtos/category.dto";
import { ChevronRight, Edit, Plus, Trash2 } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface TreeNodeProps {
    readonly node: CategoryNode;
    readonly level?: number;
    readonly expanded: Record<string, boolean>;
    readonly toggleExpand: (id: string) => void;
    readonly onEdit: (node: CategoryNode) => void;
    readonly onAdd: (parentNode: CategoryNode) => void;
    readonly onDelete: (node: CategoryNode) => void;
    readonly search?: string;
}

export default function TreeNode({
    node,
    level = 0,
    expanded,
    toggleExpand,
    onEdit,
    onAdd,
    onDelete,
    search
}: TreeNodeProps) {

    const tCategory = useTranslations("Category");
    const isExpanded = expanded[node.id] ?? false;
    const hasChildren = node.children && node.children.length > 0;

    // Function to highlight search text - memoized
    const highlightText = useMemo(() => {
        return (text: string, searchTerm: string) => {
            if (!searchTerm || !text) return text;

            const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            const parts = text.split(regex);

            return parts.map((part, index) =>
                regex.test(part) ? (
                    <mark key={index} className="bg-yellow-300 px-1 rounded font-medium">
                        {part}
                    </mark>
                ) : part
            );
        };
    }, []);

    const getTypeLabel = (type: CategoryNode["type"]) => {
        if (type === NODE_TYPE.CATEGORY) return tCategory("category");
        if (type === NODE_TYPE.SUBCATEGORY) return tCategory("subcategory");
        return tCategory("itemGroup");
    };

    return (
        <div className="tree-node">
            <div
                className={cn(
                    "fxr-c p-2 hover:bg-muted/50 rounded-md group transition-colors",
                    level > 0 ? "ml-8" : "",
                )}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
            >
                {hasChildren ? (
                    <button onClick={() => toggleExpand(node.id)} className="mr-1 p-1 rounded-full hover:bg-muted">
                        <ChevronRight
                            className={cn(
                                "h-4 w-4 transition-transform",
                                isExpanded ? "rotate-90" : ""
                            )}
                        />
                    </button>
                ) : (
                    <div className="w-6 mr-1"></div>
                )}

                <div className="flex-1">
                    <div className="fxr-c gap-2 items-baseline">
                        <p className="font-medium">{highlightText(node.name, search || "")}</p>
                        <Badge
                            variant="outline"
                            className="text-xs bg-muted border-none">
                            {highlightText(node.code, search || "")}
                        </Badge>
                        <p className="text-xs text-muted-foreground">{getTypeLabel(node.type)}</p>
                    </div>

                    <p className="text-muted-foreground">{highlightText(node.description || "", search || "")}</p>
                    {node.type === NODE_TYPE.ITEM_GROUP && <p className="text-muted-foreground">{node.itemCount}</p>}
                </div>

                <div className="fxr-c gap-1 group-hover:block hidden">
                    {node.type !== NODE_TYPE.ITEM_GROUP && (
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
                                    {node.type === NODE_TYPE.CATEGORY ? tCategory("add_subcategory") : tCategory("add_item_group")}
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
                                {node.type === NODE_TYPE.CATEGORY ? tCategory("edit_subcategory") : tCategory("edit_item_group")}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <Button
                        variant="ghost"
                        size={'sm'}
                        onClick={() => onDelete(node)}
                        className="h-6 w-6"
                    >
                        <Trash2 className="h-4 w-4" />
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
                            search={search}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
