import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { MoqInlineEdit } from "./MoqInlineEdit";
import { cn } from "@/lib/utils";

interface SelectedProduct {
  id: string;
  name: string;
  local_name?: string;
  code?: string;
  isInitial: boolean;
  product_category?: { id: string; name: string };
  product_sub_category?: { id: string; name: string };
  product_item_group?: { id: string; name: string };
  inventory_unit_name?: string;
}

interface ProductCardProps {
  product: SelectedProduct;
  onRemove: (id: string) => void;
}

export function ProductCard({ product, onRemove }: ProductCardProps) {
  const [showMoq, setShowMoq] = useState(false);

  return (
    <div className="group relative border rounded-md bg-card p-2.5 hover:border-primary/50 transition-colors">
      {/* Header: Name & Code */}
      <div className="flex items-start justify-between gap-6 pr-6">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium truncate leading-none py-0.5">{product.name}</span>
            {product.code && (
              <Badge variant={"product_badge"} className="text-xs h-4 px-1 font-normal">
                {product.code}
              </Badge>
            )}
          </div>
          {product.local_name && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">{product.local_name}</p>
          )}
        </div>
      </div>

      {/* Delete Button (Absolute) */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(product.id)}
        className="absolute top-1 right-1 h-6 w-6 text-muted-foreground/50 hover:text-destructive hover:bg-transparent opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>

      {/* Category Path */}
      <div className="flex items-center gap-1.5 mt-1 overflow-hidden">
        <div className="text-xs text-muted-foreground/70 truncate">
          {product.product_category?.name} / {product.product_sub_category?.name} /{" "}
          {product.product_item_group?.name}
        </div>
      </div>

      {/* Controls: Unit & MOQ */}
      <div className="flex items-center justify-between gap-2 mt-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium uppercase min-w-fit">
            Order Unit:
          </span>
          <Select defaultValue={product.inventory_unit_name}>
            <SelectTrigger className="h-6 text-xs w-[100px] bg-muted/30 border-border/50 focus:ring-0">
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              {product.inventory_unit_name && (
                <SelectItem value={product.inventory_unit_name} className="text-xs">
                  {product.inventory_unit_name}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-6 text-xs px-2 hover:bg-primary/5 hover:text-primary",
            showMoq && "text-primary bg-primary/5"
          )}
          onClick={() => setShowMoq(!showMoq)}
        >
          MOQ
          {showMoq ? (
            <ChevronUp className="h-3 w-3 ml-1" />
          ) : (
            <ChevronDown className="h-3 w-3 ml-1" />
          )}
        </Button>
      </div>

      {/* Inline MOQ Edit */}
      {showMoq && (
        <div className="animate-in slide-in-from-top-1 duration-200">
          <MoqInlineEdit defaultUnitName={product.inventory_unit_name} />
        </div>
      )}
    </div>
  );
}
