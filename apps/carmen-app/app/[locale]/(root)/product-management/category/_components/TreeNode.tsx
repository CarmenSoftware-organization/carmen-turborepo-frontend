import { Button } from "@/components/ui/button";
import { CategoryNode, NODE_TYPE } from "@/dtos/category.dto";
import { ChevronRight, Edit, Plus, Trash2 } from "lucide-react";

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
  search,
}: TreeNodeProps) {
  const tCategory = useTranslations("Category");
  const isExpanded = expanded[node.id] ?? false;
  const hasChildren = node.children && node.children.length > 0;

  const highlightText = useMemo(() => {
    return (text: string, searchTerm: string) => {
      if (!searchTerm || !text) return text;

      const escapedTerm = searchTerm.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
      const regex = new RegExp(`(${escapedTerm})`, "gi");

      const matches = Array.from(text.matchAll(regex));

      if (matches.length === 0) return text;

      const parts: Array<{ text: string; isMatch: boolean; start: number }> = [];
      let lastIndex = 0;

      for (const match of matches) {
        const matchStart = match.index!;
        if (matchStart > lastIndex) {
          parts.push({
            text: text.slice(lastIndex, matchStart),
            isMatch: false,
            start: lastIndex,
          });
        }
        parts.push({
          text: match[0],
          isMatch: true,
          start: matchStart,
        });

        lastIndex = matchStart + match[0].length;
      }

      if (lastIndex < text.length) {
        parts.push({
          text: text.slice(lastIndex),
          isMatch: false,
          start: lastIndex,
        });
      }

      return (
        <>
          {parts.map((part) =>
            part.isMatch ? (
              <mark key={`mark-${part.start}`} className="bg-yellow-300 px-1 rounded font-medium">
                {part.text}
              </mark>
            ) : (
              <span key={`text-${part.start}`}>{part.text}</span>
            )
          )}
        </>
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
          "fxr-c p-2 hover:bg-muted/50 rounded-md group transition-colors w-full",
          level > 0 ? "ml-8" : ""
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <button
          type="button"
          className="fxr-c flex-1 text-left"
          onClick={() => toggleExpand(node.id)}
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-label={`${getTypeLabel(node.type)}: ${node.name}`}
        >
          {hasChildren ? (
            <div className="mr-1 p-1 rounded-full hover:bg-muted" aria-hidden="true">
              <ChevronRight
                className={cn("h-4 w-4 transition-transform", isExpanded ? "rotate-90" : "")}
              />
            </div>
          ) : (
            <div className="w-6 mr-1" aria-hidden="true"></div>
          )}

          <div className="flex-1">
            <div className="fxr-c gap-1 items-baseline">
              <Badge variant="outline" className="text-xs bg-muted border-none">
                {highlightText(node.code, search || "")}
              </Badge>
              {"-"}
              <p className="font-medium">{highlightText(node.name, search || "")}</p>
              <p className="text-xs text-muted-foreground">{getTypeLabel(node.type)}</p>
            </div>

            <p className="text-muted-foreground">
              {highlightText(node.description || "", search || "")}
            </p>
            {node.type === NODE_TYPE.ITEM_GROUP && (
              <p className="text-muted-foreground">{node.itemCount}</p>
            )}
          </div>
        </button>

        <div className="flex items-center gap-2 group-hover:flex hidden">
          {node.type !== NODE_TYPE.ITEM_GROUP && (
            <Button variant="ghost" size={"sm"} onClick={() => onAdd(node)} className="h-6 w-6">
              <Plus className="h-4 w-4" />
            </Button>
          )}

          <Button variant="ghost" size={"sm"} onClick={() => onEdit(node)} className="h-6 w-6">
            <Edit className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size={"sm"} onClick={() => onDelete(node)} className="h-6 w-6">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="children ml-6">
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
  );
}
