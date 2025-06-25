"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

enum status {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

type DialogConfig = {
  isOpen: boolean;
  type: "approve" | "reject";
} | null;

const initialItems = [
  {
    id: "1",
    name: "Item 1",
    status: status.PENDING,
  },
  {
    id: "2",
    name: "Item 2",
    status: status.APPROVED,
  },
  {
    id: "3",
    name: "Item 3",
    status: status.REJECTED,
  },
  {
    id: "4",
    name: "Item 4",
    status: status.PENDING,
  },
  {
    id: "5",
    name: "Item 5",
    status: status.APPROVED,
  },
  {
    id: "6",
    name: "Item 6",
    status: status.REJECTED,
  },
];

const statusText = (st: status): string => {
  switch (st) {
    case status.PENDING:
      return "text-yellow-500";
    case status.APPROVED:
      return "text-green-500";
    case status.REJECTED:
      return "text-red-500";
    default:
      return "";
  }
};

export default function TestApproveRejectComponent() {
  const [items, setItems] = useState(initialItems);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [dialogConfig, setDialogConfig] = useState<DialogConfig>(null);

  const handleCheckboxAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((item) => item.id));
    }
  };

  const handleCheckboxChange = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleUpdateStatus = (
    newStatus: status,
    pendingOnly: boolean = false
  ) => {
    const updatedItems = items.map((item) => {
      if (selectedItems.includes(item.id)) {
        if (pendingOnly && item.status !== status.PENDING) {
          return item;
        }
        return { ...item, status: newStatus };
      }
      return item;
    });
    setItems(updatedItems);
    setSelectedItems([]);
    setDialogConfig(null);
  };

  const handleStatusButtonClick = (type: "approve" | "reject") => {
    if (selectedItems.length === items.length) {
      setDialogConfig({ isOpen: true, type });
    } else {
      handleUpdateStatus(
        type === "approve" ? status.APPROVED : status.REJECTED,
        false
      );
    }
  };

  const handleReset = () => {
    setItems(initialItems);
    setSelectedItems([]);
  };

  const getDialogTitle = () => {
    return dialogConfig?.type === "approve"
      ? "Confirm Approval"
      : "Confirm Rejection";
  };

  const getDialogDescription = () => {
    return dialogConfig?.type === "approve"
      ? "How would you like to approve the selected items?"
      : "How would you like to reject the selected items?";
  };

  const isAllSelectedItemsStatus = (checkStatus: status): boolean => {
    if (selectedItems.length === 0) return false;
    const selectedItemsList = items.filter((item) =>
      selectedItems.includes(item.id)
    );
    return selectedItemsList.every((item) => item.status === checkStatus);
  };

  const isApproveDisabled = (): boolean => {
    return selectedItems.length === 0 || isAllSelectedItemsStatus(status.APPROVED);
  };

  const isRejectDisabled = (): boolean => {
    return selectedItems.length === 0 || isAllSelectedItemsStatus(status.REJECTED);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Dialog
          open={dialogConfig !== null}
          onOpenChange={(open) => !open && setDialogConfig(null)}
        >
          <div className="flex gap-2">
            <DialogTrigger asChild>
              <Button
                className="bg-blue-500 text-white disabled:opacity-50"
                disabled={isApproveDisabled()}
                onClick={() => handleStatusButtonClick("approve")}
              >
                approve
              </Button>
            </DialogTrigger>
            <DialogTrigger asChild>
              <Button
                className="bg-red-500 text-white disabled:opacity-50"
                disabled={isRejectDisabled()}
                onClick={() => handleStatusButtonClick("reject")}
              >
                reject
              </Button>
            </DialogTrigger>
          </div>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{getDialogTitle()}</DialogTitle>
              <DialogDescription>{getDialogDescription()}</DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setDialogConfig(null)}>
                Cancel
              </Button>
              <Button
                variant="default"
                className={
                  dialogConfig?.type === "approve"
                    ? "bg-blue-500"
                    : "bg-red-500"
                }
                onClick={() =>
                  handleUpdateStatus(
                    dialogConfig?.type === "approve"
                      ? status.APPROVED
                      : status.REJECTED,
                    false
                  )
                }
              >
                {dialogConfig?.type === "approve" ? "Approve" : "Reject"} All
                Selected
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  handleUpdateStatus(
                    dialogConfig?.type === "approve"
                      ? status.APPROVED
                      : status.REJECTED,
                    true
                  )
                }
              >
                {dialogConfig?.type === "approve" ? "Approve" : "Reject"} Only
                Pending
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <button
          className="bg-gray-800 text-white px-4 py-2 rounded-md"
          onClick={handleReset}
        >
          reset
        </button>
        <div className="flex gap-2">
          <input
            type="checkbox"
            className="border border-gray-300 rounded-md p-2"
            checked={selectedItems.length === items.length}
            onChange={handleCheckboxAll}
          />
          <h2>Select All</h2>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-2 border border-gray-300 rounded-md p-4 items-center"
          >
            <input
              type="checkbox"
              className="border border-gray-300 rounded-md p-2"
              checked={selectedItems.includes(item.id)}
              onChange={() => handleCheckboxChange(item.id)}
            />
            <h2>{item.name}</h2>
            <p className={statusText(item.status)}>{item.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

