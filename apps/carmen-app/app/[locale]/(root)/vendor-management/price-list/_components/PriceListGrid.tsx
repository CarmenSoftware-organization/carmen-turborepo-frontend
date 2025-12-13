"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/lib/navigation";
import { Calendar, List, MoreHorizontal, Package, Trash2 } from "lucide-react";
import { PriceListDtoList } from "../_dto/price-list-dto";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeletePriceList } from "../_hooks/use-price-list";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { useQueryClient } from "@tanstack/react-query";
import CardLoading from "@/components/loading/CardLoading";

import { formatDate } from "@/utils/format/date";

interface PriceListGridProps {
  priceLists: any[];
  isLoading: boolean;
}

export default function PriceListGrid({ priceLists, isLoading }: PriceListGridProps) {
  const router = useRouter();
  const { token, buCode, dateFormat } = useAuth();
  const tCommon = useTranslations("Common");
  const tPriceList = useTranslations("PriceList");
  const queryClient = useQueryClient();

  const [deleteId, setDeleteId] = useState<string>("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedPriceList, setSelectedPriceList] = useState<PriceListDtoList | null>(null);

  const { mutate: deletePriceList, isPending: isDeleting } = useDeletePriceList(token, buCode);

  const handleDeleteClick = (priceList: PriceListDtoList) => {
    setSelectedPriceList(priceList);
    setAlertOpen(true);
  };

  const handleDelete = () => {
    if (!selectedPriceList?.id) return;

    setDeleteId(selectedPriceList.id);
    deletePriceList(selectedPriceList.id, {
      onSuccess: () => {
        toastSuccess({ message: "Price list deleted successfully" });
        setDeleteId("");
        setAlertOpen(false);
        setSelectedPriceList(null);
        queryClient.invalidateQueries({ queryKey: ["price-lists", buCode] });
      },
      onError: () => {
        toastError({ message: "Failed to delete price list" });
        setDeleteId("");
        setAlertOpen(false);
        setSelectedPriceList(null);
      },
    });
  };

  const handleCardClick = (id: string) => {
    router.push(`/vendor-management/price-list/${id}`);
  };

  if (isLoading) {
    return <CardLoading items={6} />;
  }

  if (priceLists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg">
        <Package className="h-10 w-10 text-muted-foreground/40 mb-3" />
        <h3 className="text-sm font-medium mb-1">{tCommon("no_data")}</h3>
        <p className="text-xs text-muted-foreground max-w-sm">
          {tPriceList("no_price_lists_description")}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {priceLists.map((priceList) => (
          <Card
            key={priceList.id}
            className="hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => handleCardClick(priceList.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base font-semibold truncate group-hover:text-primary transition-colors">
                    {priceList.no}
                  </CardTitle>
                  <CardDescription className="text-sm mt-1 truncate">
                    {priceList.vender?.name || priceList.vendor?.name}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={priceList.status} className="capitalize text-xs">
                    {priceList.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive cursor-pointer hover:bg-transparent"
                        disabled={isDeleting && deleteId === priceList.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(priceList);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {tCommon("delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                {priceList.description && (
                  <p className="text-muted-foreground line-clamp-2">{priceList.description}</p>
                )}

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span className="truncate">
                    {(() => {
                      const period = priceList.effectivePeriod;
                      if (typeof period === "string") {
                        const [start, end] = period.split(" - ");
                        if (start && end) {
                          return `${formatDate(start, dateFormat || "yyyy-MM-dd")} - ${formatDate(end, dateFormat || "yyyy-MM-dd")}`;
                        }
                        return period;
                      }
                      return `${formatDate(period?.from, dateFormat || "yyyy-MM-dd")} - ${formatDate(period?.to, dateFormat || "yyyy-MM-dd")}`;
                    })()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <List className="h-4 w-4 shrink-0" />
                    <span className="text-xs">
                      {priceList.pricelist_detail?.length || priceList.itemsCount || 0}{" "}
                      {tPriceList("items")}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {priceList.currency?.code || priceList.currency?.name}
                  </div>
                </div>

                {priceList.rfp && (
                  <div className="text-xs text-muted-foreground pt-1">{priceList.rfp.name}</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tPriceList("delete_price_list")}</AlertDialogTitle>
            <AlertDialogDescription>
              {tPriceList("delete_price_list_confirmation")} &quot;{selectedPriceList?.vendor?.name}
              &quot;? {tCommon("action_cannot_be_undone")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertOpen(false)}>
              {tCommon("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? tCommon("deleting") : tCommon("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
