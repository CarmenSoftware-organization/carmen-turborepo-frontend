"use client";

import { PermissionDemo } from "../../components/PermissionDemo";
import { prDocs } from "../../data/mock-data";

export default function PrPage() {
    return (
        <PermissionDemo
            title="Purchase Request List"
            createButtonLabel="Create PR"
            module="procurement"
            submodule="purchase_request"
            documents={prDocs}
            actionButtons={[
                {
                    label: "Edit",
                    permission: "update",
                    variant: "outline",
                    onClick: (doc) => alert(`Edit PR: ${doc.id}`),
                },
                {
                    label: "Submit",
                    permission: "submit",
                    variant: "default",
                    onClick: (doc) => alert(`Submit PR: ${doc.id}`),
                },
                {
                    label: "Approve",
                    permission: "approve",
                    variant: "default",
                    onClick: (doc) => alert(`Approve PR: ${doc.id}`),
                },
                {
                    label: "Reject",
                    permission: "reject",
                    variant: "destructive",
                    onClick: (doc) => alert(`Reject PR: ${doc.id}`),
                },
                {
                    label: "Send Back",
                    permission: "send_back",
                    variant: "outline",
                    onClick: (doc) => alert(`Send Back PR: ${doc.id}`),
                },
                {
                    label: "Delete",
                    permission: "delete",
                    variant: "destructive",
                    onClick: (doc) => alert(`Delete PR: ${doc.id}`),
                },
            ]}
        />
    );
}
