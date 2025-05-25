import { PrSchemaV2Dto } from "@/dtos/pr.dto";

export const postPrData: PrSchemaV2Dto = {
    pr_date: "2024-06-13T15:30:00Z",
    workflow_id: "f224d743-7cfa-46f6-8f72-85b14c6a355e",
    current_workflow_status: "pending",
    workflow_history: [
        {
            status: "draft",
            timestamp: "2023-10-01",
            user: "user123",
        },
    ],
    pr_status: "draft",
    requestor_id: "1bfdb891-58ee-499c-8115-34a964de8122",
    department_id: "19adcf5f-c199-4b3a-86b1-2215f362d0af",
    is_active: true,
    doc_version: 2.0,
    note: "Urgent request V2",
    info: {
        priority: "high",
        budget_code: "BUD-2023-001",
    },
    dimension: {
        cost_center: "CC-003",
        project: "Project B",
    },
    purchase_request_detail: {
        add: [
            {
                location_id: "2312a989-3a77-41b4-b794-42ea07314551",
                product_id: "549e3d2f-686a-49fb-8dae-783922bd7181",
                vendor_id: "22a1e00d-c99b-4f19-a0ee-12af1155d0a8",
                price_list_id: "14562d9e-b043-4bde-a410-1c1e1246f345",
                description: "Mouse",
                requested_qty: 5,
                requested_unit_id: "1a407903-9b9c-46cd-af2f-4cb775603c9d",
                approved_qty: 5,
                approved_unit_id: "c6ea3459-c6dd-49d9-bef3-10122b0c72f3",
                approved_base_qty: 3,
                approved_base_unit_id: "c6ea3459-c6dd-49d9-bef3-10122b0c72f3",
                approved_conversion_rate: 12,
                requested_conversion_rate: 12,
                requested_base_qty: 5,
                requested_base_unit_id: "c6ea3459-c6dd-49d9-bef3-10122b0c72f3",
                currency_id: "8fee5ec1-b15f-403a-9193-ae7de2b65e84",
                exchange_rate: 1.0,
                exchange_rate_date: "2023-10-01T00:00:00Z",
                price: 1000.0,
                total_price: 5000.0,
                foc: 12,
                foc_unit_id: "c6ea3459-c6dd-49d9-bef3-10122b0c72f3",
                tax_type_inventory_id: "c825b2da-185e-422f-8586-48313677f02d",
                tax_type: "included",
                tax_rate: 7.0,
                tax_amount: 350.0,
                is_tax_adjustment: false,
                is_discount: false,
                discount_rate: 0.0,
                discount_amount: 0.0,
                is_discount_adjustment: false,
                is_active: true,
                note: "Approved",
                info: {
                    specifications: "16GB RAM, 512GB SSD",
                },
                dimension: {
                    cost_center: "CC-001",
                    project: "Project A",
                },
            },
        ],
    },
};



