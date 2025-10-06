"use client";

import { PermissionDemo } from "../../components/PermissionDemo";
import { deliveryPointDocs } from "../../data/mock-data";

export default function DpPage() {
    return (
        <PermissionDemo
            title="Delivery Point List"
            createButtonLabel="Create Delivery Point"
            module="configuration"
            submodule="delivery_point"
            documents={deliveryPointDocs}
            actionButtons={[
                {
                    label: "Edit",
                    permission: "update",
                    variant: "outline",
                    onClick: (doc) => alert(`Edit Delivery Point: ${doc.id}`),
                },
                {
                    label: "Delete",
                    permission: "delete",
                    variant: "destructive",
                    onClick: (doc) => alert(`Delete Delivery Point: ${doc.id}`),
                },
            ]}
        />
    );
}
