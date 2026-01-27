import { useState, useCallback } from "react";
import { SortingState, OnChangeFn } from "@tanstack/react-table";
import { PurchaseRequestDetail } from "@/dtos/purchase-request.dto";

export enum PR_ITEM_BULK_ACTION {
  APPROVED = "approved",
  REVIEW = "review",
  REJECTED = "rejected",
}

interface UsePurchaseItemTableProps {
  onItemUpdate: (
    itemId: string,
    fieldName: string,
    value: unknown,
    selectedProduct?: unknown
  ) => void;
  onItemRemove: (itemId: string, isNewItem?: boolean, itemIndex?: number) => void;
  getItemValue: (item: PurchaseRequestDetail, fieldName: string) => unknown;
}

interface UsePurchaseItemTableReturn {
  // Delete dialog state
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  itemToDelete: { id: string; isAddItem: boolean; addIndex?: number } | null;
  handleRemoveItemClick: (id: string, isNewItem?: boolean, itemIndex?: number) => void;
  handleConfirmDelete: () => void;

  // Select all dialog state
  selectAllDialogOpen: boolean;
  setSelectAllDialogOpen: (open: boolean) => void;
  selectMode: "all" | "pending";
  setSelectMode: (mode: "all" | "pending") => void;

  // Bulk action dialog state
  bulkActionDialogOpen: boolean;
  setBulkActionDialogOpen: (open: boolean) => void;
  bulkActionType: PR_ITEM_BULK_ACTION | null;
  setBulkActionType: (type: PR_ITEM_BULK_ACTION | null) => void;
  bulkActionMessage: string;
  setBulkActionMessage: (message: string) => void;

  // Table state
  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;

  // Bulk actions
  handleBulkActionClick: (action: PR_ITEM_BULK_ACTION) => (e: React.MouseEvent) => void;
}

export const usePurchaseItemTable = ({
  onItemUpdate,
  onItemRemove,
  getItemValue,
}: UsePurchaseItemTableProps): UsePurchaseItemTableReturn => {
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    isAddItem: boolean;
    addIndex?: number;
  } | null>(null);

  // Select all dialog state
  const [selectAllDialogOpen, setSelectAllDialogOpen] = useState(false);
  const [selectMode, setSelectMode] = useState<"all" | "pending">("all");

  // Bulk action dialog state
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false);
  const [bulkActionType, setBulkActionType] = useState<PR_ITEM_BULK_ACTION | null>(null);
  const [bulkActionMessage, setBulkActionMessage] = useState("");

  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);

  const handleRemoveItemClick = useCallback(
    (id: string, isNewItem: boolean = false, itemIndex?: number) => {
      setItemToDelete({ id, isAddItem: isNewItem, addIndex: itemIndex });
      setDeleteDialogOpen(true);
    },
    []
  );

  const handleConfirmDelete = useCallback(() => {
    if (itemToDelete) {
      onItemRemove(itemToDelete.id, itemToDelete.isAddItem, itemToDelete.addIndex);
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  }, [itemToDelete, onItemRemove]);

  const handleBulkActionClick = useCallback(
    (action: PR_ITEM_BULK_ACTION) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setBulkActionType(action);

      // For approved action, no message needed - handled in component
      // For review and reject, show dialog for message input
      if (action !== PR_ITEM_BULK_ACTION.APPROVED) {
        setBulkActionDialogOpen(true);
      }
    },
    []
  );

  return {
    // Delete dialog
    deleteDialogOpen,
    setDeleteDialogOpen,
    itemToDelete,
    handleRemoveItemClick,
    handleConfirmDelete,

    // Select all dialog
    selectAllDialogOpen,
    setSelectAllDialogOpen,
    selectMode,
    setSelectMode,

    // Bulk action dialog
    bulkActionDialogOpen,
    setBulkActionDialogOpen,
    bulkActionType,
    setBulkActionType,
    bulkActionMessage,
    setBulkActionMessage,

    // Table state
    sorting,
    setSorting,

    // Bulk actions
    handleBulkActionClick,
  };
};

export type { UsePurchaseItemTableReturn };
