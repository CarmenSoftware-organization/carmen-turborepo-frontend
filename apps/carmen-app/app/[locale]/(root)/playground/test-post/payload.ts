export const getStatusColorTestPost = (statusSent: string) => {
    if (statusSent === "Success")
      return "bg-green-100 text-green-800 border-green-200";
    if (statusSent === "กำลังส่งข้อมูล...")
      return "bg-blue-100 text-blue-800 border-blue-200";
    if (statusSent.startsWith("Error"))
      return "bg-red-100 text-red-800 border-red-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

export const postCreditNote = {
  cn_date: "2024-04-19T10:00:00.000Z",
  doc_status: "draft",
  credit_note_type: "quantity_return",
  vendor_id: "2375bcba-81bf-4236-a35c-2798acbd321f",
  currency_id: "0540e6ca-8a08-47ef-b104-522834d5026f",
  exchange_rate: 35,
  exchange_rate_date: "2024-03-19T10:00:00.000Z",
  grn_id: "685e6c92-2e06-4702-b4fe-6fb572dd9bd3",
  cn_reason_id: "1f2c73c7-d2b5-4833-a356-ba7a76209bbc",
  invoice_no: "DDD-0001",
  invoice_date: "2024-03-19T10:00:00.000Z",
  tax_invoice_no: "TAXI-002",
  tax_invoice_date: "2024-03-19T10:00:00.000Z",
  note: "ธนวัตร ทดสอบการส่งข้อมูล",
  description: "ธนวัตร ทดสอบการส่งข้อมูล",
  credit_note_detail: {
    add: [
      {
        description: "ธนวัตร ทดสอบการส่งข้อมูล",
        note: "ธนวัตร ทดสอบการส่งข้อมูล",
        location_id: "213f41eb-6916-4275-ac53-afe6b7880dd2",
        product_id: "d2b38f5f-1aa6-4e50-acce-a6e0c8b55db5",
        return_qty: 20,
        return_unit_id: "0730ff57-fcf2-4df4-a044-986dbac67934",
        return_conversion_factor: 1,
        return_base_qty: 1,
        price: 500,
        tax_type_inventory_id: "5f1cded9-e1fe-474a-bbbf-f5dfb26308e9",
        tax_rate: 3,
        tax_amount: 220,
        is_tax_adjustment: false,
        discount_rate: 0,
        discount_amount: 0,
        is_discount_adjustment: false,
        extra_cost_amount: 0,
        base_price: 120,
        base_tax_amount: 120,
        base_discount_amount: 0,
        base_extra_cost_amount: 0,
        total_price: 200,
      },
    ],
  },
};

export const postGoodReceiveNote = {
  invoice_no: "PO20250617002",
  invoice_date: "2025-03-07T17:00:00.000Z",
  description: "ทดสอบการส่งข้อมูล good receive note",
  doc_status: "draft",
  doc_type: "manual",
  vendor_id: "2375bcba-81bf-4236-a35c-2798acbd321f",
  currency_id: "0540e6ca-8a08-47ef-b104-522834d5026f",
  currency_rate: 0,
  workflow_id: "ac710822-d422-4e29-8439-87327e960a0e",
  is_consignment: true,
  is_cash: true,
  signature_image_url: "img.carmen.com/img/savasvkd34",
  received_by_id: "1bfdb891-58ee-499c-8115-34a964de8122",
  received_at: "2025-04-07T17:00:00.000Z",
  credit_term_id: "811fb3e4-755f-4767-bde3-c840f147c645",
  payment_due_date: "2025-05-07T17:00:00.000Z",
  is_active: true,
  good_received_note_detail: {
    add: [
      {
        // "purchase_order_detail_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        sequence_no: 0,
        location_id: "213f41eb-6916-4275-ac53-afe6b7880dd2",
        product_id: "d2b38f5f-1aa6-4e50-acce-a6e0c8b55db5",
        order_qty: 0,
        order_unit_id: "39948eca-2422-4382-9cc0-32038976c262",
        received_qty: 0,
        received_unit_id: "39948eca-2422-4382-9cc0-32038976c262",
        foc_qty: 0,
        foc_unit_id: "39948eca-2422-4382-9cc0-32038976c262",
        price: 0,
        tax_type_inventory_id: "5f1cded9-e1fe-474a-bbbf-f5dfb26308e9",
        tax_type: "none",
        tax_rate: 0,
        tax_amount: 0,
        is_tax_adjustment: true,
        total_amount: 0,
        delivery_point_id: "086fc8ef-cb01-4a7f-b421-0ec2bdfb10bf",
        base_price: 0,
        base_qty: 0,
        extra_cost: 0,
        total_cost: 0,
        discount_rate: 0,
        discount_amount: 0,
        expired_date: "2025-05-07T17:00:00.000Z",
      },
    ],
  },
  extra_cost: {
    name: "ค่าขนส่ง easy express 4", // Name ห้ามซ้ำ
    allocate_extra_cost_type: "manual",
    note: "ทดสอบการส่งข้อมูล note extra cost",
    extra_cost_detail: {
      add: [
        {
          extra_cost_type_id: "59628ab6-55d8-41b4-ac8c-0491ac84a538",
          amount: 0,
          tax_type_inventory_id: "5f1cded9-e1fe-474a-bbbf-f5dfb26308e9",
          tax_type: "none",
          tax_rate: 0,
          tax_amount: 0,
          is_tax_adjustment: true,
          note: "ทดสอบการส่งข้อมูล note extra cost detail",
        },
      ],
    },
  },
};
