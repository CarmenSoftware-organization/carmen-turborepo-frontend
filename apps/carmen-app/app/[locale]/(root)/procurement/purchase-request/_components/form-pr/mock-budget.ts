import { ActivityLogItem } from "@/components/comment-activity/ActivityLogComponent";
import { CommentItem } from "@/components/comment-activity/CommentComponent";

export const mockActivityPr: ActivityLogItem[] = [
  {
    id: "1",
    date: "2024-01-15 10:30",
    user: "Somchai Jaidee",
    action: "สร้าง Purchase Request #PR-2024-0001",
  },
  {
    id: "2",
    date: "2024-01-15 14:45",
    user: "Pranee Smith",
    action: "อัปเดตรายการสินค้า - เพิ่มน้ำมันพืช 5 ลิตร จำนวน 10 ขวด",
  },
  {
    id: "3",
    date: "2024-01-16 09:15",
    user: "Krit Manager",
    action: "ส่งเอกสารเพื่อขออนุมัติ",
  },
  {
    id: "4",
    date: "2024-01-16 16:20",
    user: "Niran Supervisor",
    action: "อนุมัติคำขอ - จำนวนเงิน 125,500 บาท",
  },
  {
    id: "5",
    date: "2024-01-17 08:30",
    user: "Siriporn Buyer",
    action: "ส่งไปยัง Procurement Department",
  },
  {
    id: "6",
    date: "2024-01-17 11:45",
    user: "Jirawat Procurement",
    action: "สร้าง Purchase Order #PO-2024-0028",
  },
  {
    id: "7",
    date: "2024-01-18 13:10",
    user: "Vendor ABC",
    action: "ยืนยันรับ Purchase Order",
  },
  {
    id: "8",
    date: "2024-01-20 15:30",
    user: "Malee Receiver",
    action: "รับสินค้าครบถ้วน - สร้าง Goods Received Note #GRN-2024-0015",
  },
];

export const mockCommentsPr: CommentItem[] = [
  {
    id: "c1",
    poster: "Somchai Jaidee",
    message: "สร้าง PR ใหม่สำหรับวัตถุดิบครัว ต้องการใช้ภายในสัปดาห์หน้า",
    date: "2024-01-15 10:35",
    attachments: [],
  },
  {
    id: "c2",
    poster: "Pranee Smith",
    message: "ได้ตรวจสอบรายการแล้ว มีคำถามเรื่องจำนวนน้ำมันพืช ต้องการ 10 ขวดจริงหรือครับ?",
    date: "2024-01-15 11:20",
    attachments: [
      {
        id: "att1",
        file: "vegetable-oil-specifications.pdf",
      },
    ],
  },
  {
    id: "c3",
    poster: "Krit Manager",
    message: "ยืนยันจำนวน 10 ขวด เนื่องจากมีโปรโมชั่นจากร้านค้า และเก็บได้นาน",
    date: "2024-01-15 14:15",
    attachments: [],
  },
  {
    id: "c4",
    poster: "Niran Supervisor",
    message: "อนุมัติแล้ว งบประมาณอยู่ในกรอบที่กำหนด สามารถดำเนินการต่อได้",
    date: "2024-01-16 16:25",
    attachments: [
      {
        id: "att2",
        file: "budget-approval-certificate.pdf",
      },
    ],
  },
  {
    id: "c5",
    poster: "Siriporn Buyer",
    message: "ได้รับเอกสารแล้ว จะส่งต่อไปยังทีม Procurement เพื่อดำเนินการจัดซื้อ",
    date: "2024-01-17 08:45",
    attachments: [],
  },
  {
    id: "c6",
    poster: "Jirawat Procurement",
    message: "สร้าง PO เรียบร้อยแล้ว ส่งไปยัง Vendor ABC แล้ว คาดว่าจะได้รับสินค้าภายใน 3 วัน",
    date: "2024-01-17 12:00",
    attachments: [
      {
        id: "att3",
        file: "PO-2024-0028.pdf",
      },
      {
        id: "att4",
        file: "vendor-contact-info.xlsx",
      },
    ],
  },
  {
    id: "c7",
    poster: "Vendor ABC",
    message: "ได้รับ PO แล้ว ยืนยันการจัดส่งวันที่ 20 มกราคม ตามเวลาที่กำหนด",
    date: "2024-01-18 13:30",
    attachments: [],
  },
  {
    id: "c8",
    poster: "Malee Receiver",
    message: "รับสินค้าครบถ้วนแล้ว คุณภาพดี ตรงตามที่สั่ง ขอบคุณทุกฝ่ายที่ร่วมมือ",
    date: "2024-01-20 15:45",
    attachments: [
      {
        id: "att5",
        file: "goods-received-photos.jpg",
      },
      {
        id: "att6",
        file: "quality-check-report.pdf",
      },
    ],
  },
];
