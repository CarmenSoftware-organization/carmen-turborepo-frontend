export const postGrnData = {
    name: "daew test 2",
    invoice_no: "INV-008-5",
    invoice_date: "2024-01-01T00:00:00.000Z",
    description: "test post grn description",
    doc_status: "draft",
    doc_type: "manual",
    vendor_id: "01e9b558-3c17-42b0-b95d-2aece05ebd29",
    currency_id: "01e9b558-3c17-42b0-b95d-2aece05ebd29",
    currency_rate: 30,
    workflow_id: "01e9b558-3c17-42b0-b95d-2aece05ebd29",
    workflow_object: "manual",
    workflow_history: "",
    current_workflow_status: "draft",
    is_consignment: false,
    is_cash: false,
    signature_image_url: "https://via.placeholder.com/150",
    received_by_id: "01e9b558-3c17-42b0-b95d-2aece05ebd29",
    received_at: "2024-01-01T00:00:00.000Z",
    credit_term_id: "01e9b558-3c17-42b0-b95d-2aece05ebd29",
    payment_due_date: "2024-01-31T00:00:00.000Z",
    is_active: true,
    note: "test note",
    info: "test info",
    dimension: "test dimension",
    good_received_note_detail: {
        add: [
            {
                purchase_order_detail_id: "01e9b558-3c17-42b0-b95d-2aece05ebd29",
                sequence_no: 1,
                location_id: "87468579-7540-4fd5-82a3-2ff922e3df2a",
                product_id: "786ee126-35e4-41d2-8f6b-8843bb1b0f20",
                order_qty: 1,
                order_unit_id: "0ba3a2ed-09db-46ae-828d-40dcc3ea3b27",
                received_qty: 1,
                received_unit_id: "4b84205f-5102-41fa-8a18-42b687a7956e",
                is_foc: true,
                foc_qty: 1,
                foc_unit_id: "5deb0125-97aa-48c2-a3ca-7f04eff87323",
                price: 0,
                tax_type_inventory_id: "a905d0a0-3245-4db9-9395-9779d19790d2",
                tax_type: "none",
                tax_rate: 1,
                tax_amount: 1,
                is_tax_adjustment: true,
                total_amount: 0,
                delivery_point_id: "11747bbe-ef49-4003-a66a-11c425e25c53",
                base_price: 0,
                base_qty: 0,
                extra_cost: 0,
                total_cost: 0,
                is_discount: true,
                discount_rate: 0,
                discount_amount: 0,
                is_discount_adjustment: true,
                expired_date: "2024-12-31T00:00:00.000Z",
                note: "test note",
                info: "test info",
                dimension: "test dimension"
            }
        ]
    },
    extra_cost: {
        name: "test extra cost",
        allocate_extracost_type: "manual",
        note: "test extra cost note",
        info: "test extra cost info",
        extra_cost_detail: {
            add: [
                {
                    extra_cost_type_id: "01e9b558-3c17-42b0-b95d-2aece05ebd29",
                    amount: 100,
                    is_tax: false,
                    tax_type_inventory_id: "a905d0a0-3245-4db9-9395-9779d19790d2",
                    tax_type: "none",
                    tax_rate: 0,
                    tax_amount: 0,
                    is_tax_adjustment: false,
                    note: "test extra cost detail note",
                    info: "test extra cost detail info",
                    dimension: "test extra cost detail dimension"
                }
            ]
        }
    }
};
