import { ActivityLogItem } from "@/components/comment-activity/ActivityLogComponent";
import { CommentItem } from "@/components/comment-activity/CommentComponent";

export type BudgetItem = {
  id: string;
  location: string;
  category: string;
  total_budget: number;
  soft_commitment: {
    dept_head: number;
    form_po: number;
  };
  hard_commitment: number;
  available_budget: number;
  current_pr_amount: number;
  status: "Over Budget" | "Within Budget";
};

export const mockBgData: BudgetItem[] = [
  {
    id: "bg-1",
    location: "Location 1",
    category: "Category 1",
    total_budget: 100000,
    soft_commitment: {
      dept_head: 1000,
      form_po: 2000,
    },
    hard_commitment: 5000,
    current_pr_amount: 10000,
    available_budget: 82000, // 100000 - (1000+2000+5000+10000)
    status: "Within Budget",
  },
  {
    id: "bg-2",
    location: "Location 2",
    category: "Category 2",
    total_budget: 75000,
    soft_commitment: {
      dept_head: 3000,
      form_po: 2500,
    },
    hard_commitment: 7000,
    current_pr_amount: 10000,
    available_budget: 52500,
    status: "Within Budget",
  },
  {
    id: "bg-3",
    location: "Location 3",
    category: "Category 3",
    total_budget: 60000,
    soft_commitment: {
      dept_head: 2000,
      form_po: 3000,
    },
    hard_commitment: 5000,
    current_pr_amount: 52000,
    available_budget: -4000,
    status: "Over Budget",
  },
];

interface PricelistItem {
  id: string;
  vendor_name: string;
  preferred: boolean;
  rating: number;
  products: string;
  description?: string;
  start_date: string;
  end_date: string;
  pl_no: string;
  currency: string;
  price: number;
  unit: string;
  min_qty: number;
  base_unit: string;
  expire_date: number;
}


export const mockPricelistItems: PricelistItem[] = [
  {
    id: '06fsgG',
    vendor_name: 'Acme Supplies',
    preferred: true,
    rating: 4.5,
    products: 'Pigment',
    description: 'High-quality office supplies.',
    start_date: '2025-07-01',
    end_date: '2025-12-31',
    pl_no: 'PL-ACME-2025',
    currency: 'USD',
    price: 25.5,
    unit: 'box',
    min_qty: 10,
    base_unit: 'piece',
    expire_date: 3,
  },
  {
    id: 'BmESjn',
    vendor_name: 'Global Industrial',
    preferred: false,
    rating: 3.8,
    products: 'Beef',
    description: 'Bulk industrial parts.',
    start_date: '2025-06-15',
    end_date: '2025-11-30',
    pl_no: 'PL-GLOBAL-2025',
    currency: 'EUR',
    price: 102.99,
    unit: 'set',
    min_qty: 5,
    base_unit: 'unit',
    expire_date: 2,
  },
  {
    id: 'Iku7jI',
    vendor_name: 'TechGear Inc.',
    preferred: true,
    rating: 4.9,
    products: 'เบอร์กระดาษ',
    start_date: '2025-08-01',
    end_date: '2026-01-31',
    pl_no: 'PL-TECH-2025',
    currency: 'USD',
    price: 199.99,
    unit: 'kit',
    min_qty: 1,
    base_unit: 'kit',
    expire_date: 3,
  },
  {
    id: 'WoNLzb',
    vendor_name: 'Eco Packaging',
    preferred: false,
    rating: 4.0,
    products: 'ดินสอ',
    description: 'Sustainable packaging solutions.',
    start_date: '2025-05-01',
    end_date: '2025-10-31',
    pl_no: 'PL-ECO-2025',
    currency: 'GBP',
    price: 12.75,
    unit: 'roll',
    min_qty: 20,
    base_unit: 'meter',
    expire_date: 2,
  },
  {
    id: 'r_BQFj',
    vendor_name: 'Eco',
    preferred: false,
    rating: 4.0,
    products: 'ทิชชู่',
    description: 'packaging',
    start_date: '2025-05-01',
    end_date: '2025-10-31',
    pl_no: 'PL-ECO-2025',
    currency: 'USD',
    price: 12.75,
    unit: 'roll',
    min_qty: 20,
    base_unit: 'meter',
    expire_date: 10,
  },
];

export const mockActivityPr: ActivityLogItem[] = [
  {
    id: "1",
    date: "2024-01-15 10:30",
    user: "Somchai Jaidee",
    action: "สร้าง Purchase Request #PR-2024-0001"
  },
  {
    id: "2",
    date: "2024-01-15 14:45",
    user: "Pranee Smith",
    action: "อัปเดตรายการสินค้า - เพิ่มน้ำมันพืช 5 ลิตร จำนวน 10 ขวด"
  },
  {
    id: "3",
    date: "2024-01-16 09:15",
    user: "Krit Manager",
    action: "ส่งเอกสารเพื่อขออนุมัติ"
  },
  {
    id: "4",
    date: "2024-01-16 16:20",
    user: "Niran Supervisor",
    action: "อนุมัติคำขอ - จำนวนเงิน 125,500 บาท"
  },
  {
    id: "5",
    date: "2024-01-17 08:30",
    user: "Siriporn Buyer",
    action: "ส่งไปยัง Procurement Department"
  },
  {
    id: "6",
    date: "2024-01-17 11:45",
    user: "Jirawat Procurement",
    action: "สร้าง Purchase Order #PO-2024-0028"
  },
  {
    id: "7",
    date: "2024-01-18 13:10",
    user: "Vendor ABC",
    action: "ยืนยันรับ Purchase Order"
  },
  {
    id: "8",
    date: "2024-01-20 15:30",
    user: "Malee Receiver",
    action: "รับสินค้าครบถ้วน - สร้าง Goods Received Note #GRN-2024-0015"
  }
];

export const mockCommentsPr: CommentItem[] = [
  {
    id: "c1",
    poster: "Somchai Jaidee",
    message: "สร้าง PR ใหม่สำหรับวัตถุดิบครัว ต้องการใช้ภายในสัปดาห์หน้า",
    date: "2024-01-15 10:35",
    attachments: []
  },
  {
    id: "c2",
    poster: "Pranee Smith",
    message: "ได้ตรวจสอบรายการแล้ว มีคำถามเรื่องจำนวนน้ำมันพืช ต้องการ 10 ขวดจริงหรือครับ?",
    date: "2024-01-15 11:20",
    attachments: [
      {
        id: "att1",
        file: "vegetable-oil-specifications.pdf"
      }
    ]
  },
  {
    id: "c3",
    poster: "Krit Manager",
    message: "ยืนยันจำนวน 10 ขวด เนื่องจากมีโปรโมชั่นจากร้านค้า และเก็บได้นาน",
    date: "2024-01-15 14:15",
    attachments: []
  },
  {
    id: "c4",
    poster: "Niran Supervisor",
    message: "อนุมัติแล้ว งบประมาณอยู่ในกรอบที่กำหนด สามารถดำเนินการต่อได้",
    date: "2024-01-16 16:25",
    attachments: [
      {
        id: "att2",
        file: "budget-approval-certificate.pdf"
      }
    ]
  },
  {
    id: "c5",
    poster: "Siriporn Buyer",
    message: "ได้รับเอกสารแล้ว จะส่งต่อไปยังทีม Procurement เพื่อดำเนินการจัดซื้อ",
    date: "2024-01-17 08:45",
    attachments: []
  },
  {
    id: "c6",
    poster: "Jirawat Procurement",
    message: "สร้าง PO เรียบร้อยแล้ว ส่งไปยัง Vendor ABC แล้ว คาดว่าจะได้รับสินค้าภายใน 3 วัน",
    date: "2024-01-17 12:00",
    attachments: [
      {
        id: "att3",
        file: "PO-2024-0028.pdf"
      },
      {
        id: "att4",
        file: "vendor-contact-info.xlsx"
      }
    ]
  },
  {
    id: "c7",
    poster: "Vendor ABC",
    message: "ได้รับ PO แล้ว ยืนยันการจัดส่งวันที่ 20 มกราคม ตามเวลาที่กำหนด",
    date: "2024-01-18 13:30",
    attachments: []
  },
  {
    id: "c8",
    poster: "Malee Receiver",
    message: "รับสินค้าครบถ้วนแล้ว คุณภาพดี ตรงตามที่สั่ง ขอบคุณทุกฝ่ายที่ร่วมมือ",
    date: "2024-01-20 15:45",
    attachments: [
      {
        id: "att5",
        file: "goods-received-photos.jpg"
      },
      {
        id: "att6",
        file: "quality-check-report.pdf"
      }
    ]
  }
]
