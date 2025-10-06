"use client";

import { PermissionDemo } from "../../components/PermissionDemo";
import { poDocs } from "../../data/mock-data";

export default function PoPage() {
    return (
        <PermissionDemo
            title="Purchase Order List"
            createButtonLabel="Create PO"
            module="procurement"
            submodule="purchase_order"
            documents={poDocs}
            actionButtons={[
                {
                    label: "Edit",
                    permission: "update",
                    variant: "outline",
                    onClick: (doc) => alert(`Edit PO: ${doc.id}`),
                },
                {
                    label: "Submit",
                    permission: "submit",
                    variant: "default",
                    onClick: (doc) => alert(`Submit PO: ${doc.id}`),
                },
                {
                    label: "Approve",
                    permission: "approve",
                    variant: "default",
                    onClick: (doc) => alert(`Approve PO: ${doc.id}`),
                },
                {
                    label: "Reject",
                    permission: "reject",
                    variant: "destructive",
                    onClick: (doc) => alert(`Reject PO: ${doc.id}`),
                },
                {
                    label: "Send Back",
                    permission: "send_back",
                    variant: "outline",
                    onClick: (doc) => alert(`Send Back PO: ${doc.id}`),
                },
                {
                    label: "Delete",
                    permission: "delete",
                    variant: "destructive",
                    onClick: (doc) => alert(`Delete PO: ${doc.id}`),
                },
            ]}
        />
    );
}
