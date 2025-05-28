import { CreateGRNDto } from "@/dtos/grn.dto";

export const postGrnData: CreateGRNDto = {
    name: "test Daew",
    grn_no: "TEST-GRN-002",
    description: "test",
    doc_status: "draft",
    doc_type: "manual",
    vendor_id: "22a1e00d-c99b-4f19-a0ee-12af1155d0a8",
    currency_id: "8fee5ec1-b15f-403a-9193-ae7de2b65e84",
    workflow_id: "f224d743-7cfa-46f6-8f72-85b14c6a355e",
    workflow_obj: { test1: "test1", test2: "test2" },
    workflow_history: { test1: "test1", test2: "test2" },
    current_workflow_status: "test",
    is_consignment: true,
    is_cash: true,
    signature_image_url: "test.com",
    credit_term_id: "2dcac4f8-4dd2-4a51-b93e-2bc815eb786d",
    is_active: true,
    note: "string",
    info: { test1: "test1", test2: "test2" },
    dimension: { test1: "test1", test2: "test2" },
    good_received_note_detail: {
        add: [
            {
                sequence_no: 10,
                location_id: "0a1dbe33-76d7-44a8-b623-59aaaf035d08",
                product_id: "549e3d2f-686a-49fb-8dae-783922bd7181",
                order_qty: 10,
                order_unit_id: "21cd1230-0409-42b1-be22-89b76dd53322",
                received_qty: 10,
                received_unit_id: "21cd1230-0409-42b1-be22-89b76dd53322",
                is_foc: true,
                foc_qty: 10,
                foc_unit_id: "21cd1230-0409-42b1-be22-89b76dd53322",
                price: 0,
                tax_type_inventory_id: "609f3352-e5e4-4503-b0dd-aa50cd1ef0aa",
                tax_type: "none",
                tax_rate: 10,
                tax_amount: 10,
                is_tax_adjustment: true,
                total_amount: 10,
                delivery_point_id: "2801dc08-d545-4dc0-aa02-e449f67d4553",
                base_price: 10,
                base_qty: 10,
                extra_cost: 10,
                total_cost: 10,
                is_discount: true,
                discount_rate: 10,
                discount_amount: 10,
                is_discount_adjustment: true,
                note: "test",
                info: { test1: "test1", test2: "test2" },
                dimension: { test1: "test1", test2: "test2" }
            }
        ],
        update: [],
        delete: []
    },
    extra_cost: {
        name: "test extra cost",
        allocate_extracost_type: "manual",
        note: "string",
        info: { test1: "test1", test2: "test2" },
        extra_cost_detail: {
            add: [
                {
                    extra_cost_type_id: "ed43a300-440d-4888-b739-8c6891201212",
                    amount: 0,
                    is_tax: true,
                    tax_type_inventory_id: "609f3352-e5e4-4503-b0dd-aa50cd1ef0aa",
                    tax_type: "none",
                    tax_rate: 10,
                    tax_amount: 10,
                    is_tax_adjustment: true,
                    note: "test",
                    info: { test1: "test1", test2: "test2" },
                    dimension: { test1: "test1", test2: "test2" }
                }
            ]
        }
    }
};
