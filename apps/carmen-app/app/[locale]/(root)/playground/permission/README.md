# Permission System Demo

ระบบ Demo สำหรับจัดการ Permission-based Access Control (PBAC) ที่ออกแบบมาเพื่อทดสอบการแสดงผลและการจัดการสิทธิ์ผู้ใช้งานในระบบ Carmen

## 📁 โครงสร้างโปรเจค

```
playground/permission/
├── types/
│   └── permission.types.ts          # TypeScript type definitions
├── utils/
│   └── permission-checker.ts        # Pure functions สำหรับ permission logic (ใช้ได้ทุกที่)
├── data/
│   └── mock-data.ts                 # ข้อมูล mock สำหรับทดสอบ (Single Source of Truth)
├── hooks/
│   └── usePermission.ts             # React Hook wrapper สำหรับ React components
├── components/
│   └── PermissionDemo.tsx           # Reusable UI component (Optional สำหรับ demo)
├── procurement/
│   ├── pr/page.tsx                  # หน้า Purchase Request
│   └── po/page.tsx                  # หน้า Purchase Order
├── configuration/
│   └── delivery_point/page.tsx      # หน้า Delivery Point
├── permission-module.ts             # Re-export และ permission definitions
├── README.md                        # เอกสารหลัก (ไฟล์นี้)
└── USAGE.md                         # คู่มือการใช้งาน Pure Functions
```

### 🏗️ Architecture Layers

```
┌─────────────────────────────────────┐
│   UI Layer (Optional)               │
│   - components/PermissionDemo.tsx   │  ← Demo UI Component
│   - pages/*.tsx                      │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   React Layer (Optional)            │
│   - hooks/usePermission.ts          │  ← React Hook Wrapper
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Core Logic (Pure Functions) ✅    │
│   - utils/permission-checker.ts     │  ← ใช้ได้ทุกที่ ไม่ผูกกับ UI
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Data Layer                        │
│   - types/permission.types.ts       │  ← Type Definitions
│   - data/mock-data.ts               │  ← Mock Data
└─────────────────────────────────────┘
```

## 🎯 ฟีเจอร์หลัก

### 1. **Pure Functions (Core)**
- ✅ **ไม่ผูกกับ UI Framework** - ใช้ได้ทุกที่ (React, Vue, Angular, Node.js, etc.)
- ✅ **Type-Safe** - TypeScript types ครบถ้วน
- ✅ **Testable** - Pure functions ง่ายต่อการทดสอบ
- ✅ **Reusable** - นำไปใช้ใน API, Middleware, Service Layer ได้

### 2. **Permission-Based Access Control**
- ระบบตรวจสอบสิทธิ์การเข้าถึงตาม role และ permission ของผู้ใช้
- รองรับหลายระดับการเข้าถึง: `view_all`, `view_dp`, `view`, `create`, `update`, `delete`, `approve`, `reject`, `send_back`, `submit`

### 3. **Document Filtering**
- **view_all**: เห็นเอกสารทั้งหมด
- **view**: เห็นเฉพาะเอกสารของตัวเอง (ถ้ามี ownerId)
- **view_dp**: เห็นเอกสารตาม department
- Configuration data (ไม่มี owner): ทุกคนเห็นได้ถ้ามี permission view

### 4. **Action Buttons (UI Layer)**
- แสดง/ซ่อนปุ่มตาม permission ที่ผู้ใช้มี
- แต่ละ action มี variant ที่เหมาะสม (default, outline, destructive)

## 📋 รายละเอียดแต่ละไฟล์

### utils/permission-checker.ts ⭐ (Core)

**วัตถุประสงค์**: Pure functions สำหรับ permission logic - **ใช้ได้ทุกที่ ไม่ผูกกับ UI**

**Functions ที่สำคัญ**:

1. **hasPermission()** - เช็ค permission เดี่ยว
   ```typescript
   hasPermission(user, "procurement", "purchase_request", "create")
   // → true/false
   ```

2. **filterDocumentsByPermission()** - กรองเอกสารตาม permission
   ```typescript
   filterDocumentsByPermission(docs, user, "procurement", "pr", userId)
   // → [filtered documents]
   ```

3. **getPermissionFlags()** - ดึง boolean flags ทั้งหมด
   ```typescript
   getPermissionFlags(user, "procurement", "pr")
   // → { canCreate: true, canUpdate: true, ... }
   ```

4. **canPerformAction()** - เช็ค permission + ownership
   ```typescript
   canPerformAction(user, "procurement", "pr", "delete", document, userId)
   // → true/false
   ```

5. **getModulePermissions()** - ดึง permissions ทั้งหมด
6. **checkPermissions()** - เช็คหลาย permission พร้อมกัน

**ใช้งานได้ที่**:
- ✅ React Components
- ✅ API/Service Layer
- ✅ Middleware/Guards
- ✅ Node.js Backend
- ✅ Vue/Angular/Svelte
- ✅ Vanilla JavaScript

**ดูตัวอย่างเพิ่มเติมที่**: [USAGE.md](./USAGE.md)

### types/permission.types.ts

**วัตถุประสงค์**: กำหนด TypeScript types สำหรับทั้งระบบ

```typescript
// ประเภท Permission actions
PermissionAction = "view_all" | "view_dp" | "view" | "create" | ...

// ประเภทเอกสาร
BaseDocument           // เอกสารพื้นฐาน (ownerId optional)
ProcurementDocument    // เอกสาร Procurement (ต้องมี ownerId)
ConfigurationDocument  // เอกสาร Configuration (ไม่มี ownerId)

// ข้อมูลผู้ใช้และ permission
UserPermissions        // โครงสร้าง user พร้อม permission

// Return type ของ hook
ModulePermissionsHook  // Type ของค่าที่ useModulePermissions return
```

### data/mock-data.ts

**วัตถุประสงค์**: จัดเก็บข้อมูล mock ทั้งหมดในที่เดียว (Single Source of Truth)

**ข้อมูลที่มี**:
- `prDocs`: Purchase Request 10 รายการ
- `poDocs`: Purchase Order 10 รายการ
- `deliveryPointDocs`: Delivery Point 10 รายการ (ไม่มี ownerId)
- `usersPermissionTest`: ผู้ใช้ทดสอบ 5 คน

**User Roles**:
1. **Alice (admin)**: มีสิทธิ์ทุกอย่าง
2. **Bob (header)**: มีสิทธิ์ approve/reject และจัดการเอกสาร
3. **Charlie (approver)**: มีสิทธิ์ approve/reject เท่านั้น
4. **David (requester)**: มีสิทธิ์สร้างและแก้ไขเอกสารของตัวเอง
5. **Eve (guest)**: มีสิทธิ์ดูเอกสารเท่านั้น

### hooks/usePermission.ts (React Wrapper)

**วัตถุประสงค์**: React Hook wrapper สำหรับใช้ใน React components

**ความสัมพันธ์**: Hook นี้เป็นเพียง wrapper ที่เรียกใช้ pure functions จาก `utils/permission-checker.ts`

```typescript
// Hook นี้ import functions จาก utils/permission-checker.ts
import {
  hasPermission,
  filterDocumentsByPermission,
  getPermissionFlags,
} from "../utils/permission-checker";

// จากนั้น wrap เป็น React Hook
export const useModulePermissions = (user, module, submodule, userId) => {
  const flags = getPermissionFlags(user, module, submodule);
  // ...
  return {
    hasPermission: (action) => hasPermission(user, module, submodule, action),
    filterDocuments: (docs) => filterDocumentsByPermission(docs, user, module, submodule, userId),
    ...flags,
  };
};
```

**การใช้งานใน React Component**:

```typescript
function MyComponent() {
  const {
    hasPermission,      // function ตรวจสอบ permission
    filterDocuments,    // function กรองเอกสาร
    canViewAll,         // boolean flags
    canView,
    canCreate,
    canUpdate,
    canDelete,
    canApprove,
    canReject,
    canSendBack,
    canSubmit,
  } = useModulePermissions(user, "procurement", "purchase_request", userId);

  return (
    <button disabled={!canCreate}>Create</button>
  );
}
```

**หมายเหตุ**: ถ้าไม่ใช้ React สามารถใช้ pure functions จาก `utils/permission-checker.ts` ได้โดยตรง

### components/PermissionDemo.tsx

**วัตถุประสงค์**: Reusable component สำหรับสร้างหน้า permission demo

**Props**:
```typescript
interface PermissionDemoProps {
  title: string                    // หัวข้อหน้า
  createButtonLabel: string        // ข้อความปุ่มสร้าง
  module: string                   // ชื่อ module เช่น "procurement"
  submodule: string                // ชื่อ submodule เช่น "purchase_request"
  documents: T[]                   // รายการเอกสาร
  actionButtons: ActionButton[]    // ปุ่มต่างๆ ใน dialog
  renderDocumentDetails?: (doc) => ReactNode  // (optional) แสดงข้อมูลเพิ่มเติม
  getStatusVariant?: (status) => BadgeVariant // (optional) กำหนดสี badge
}
```

**การทำงาน**:
1. แสดง dropdown เลือกผู้ใช้
2. แสดงข้อมูล permission ของผู้ใช้ที่เลือก
3. แสดงจำนวนเอกสารที่เห็นได้
4. กรองเอกสารตาม permission
5. แสดงเอกสารเป็น card grid
6. เมื่อคลิก card เปิด dialog พร้อมปุ่มตาม permission

**ข้อดี**:
- ลดโค้ดซ้ำซ้อน ~74-81%
- ใช้งานง่าย แค่ส่ง props
- Consistent UI ทุกหน้า
- Type-safe ด้วย TypeScript generics

### หน้า Demo ต่างๆ

#### procurement/pr/page.tsx (Purchase Request)
```typescript
<PermissionDemo
  title="Purchase Request List"
  createButtonLabel="Create PR"
  module="procurement"
  submodule="purchase_request"
  documents={prDocs}
  actionButtons={[
    { label: "Edit", permission: "update", variant: "outline" },
    { label: "Submit", permission: "submit" },
    { label: "Approve", permission: "approve" },
    { label: "Reject", permission: "reject", variant: "destructive" },
    { label: "Send Back", permission: "send_back", variant: "outline" },
    { label: "Delete", permission: "delete", variant: "destructive" },
  ]}
/>
```

#### procurement/po/page.tsx (Purchase Order)
เหมือน PR แต่เปลี่ยน module เป็น `purchase_order`

#### configuration/delivery_point/page.tsx (Delivery Point)
```typescript
<PermissionDemo
  title="Delivery Point List"
  createButtonLabel="Create Delivery Point"
  module="configuration"
  submodule="delivery_point"
  documents={deliveryPointDocs}
  actionButtons={[
    { label: "Edit", permission: "update", variant: "outline" },
    { label: "Delete", permission: "delete", variant: "destructive" },
  ]}
/>
```

**ความแตกต่าง**:
- ไม่มี workflow buttons (Approve/Reject/Submit)
- ไม่มี ownerId (ทุกคนเห็นได้ถ้ามี permission)

## 🚀 วิธีใช้งาน

> **สำคัญ**: ระบบนี้แยก Logic ออกจาก UI แล้ว มี 2 วิธีการใช้งาน:
> 1. **ใช้ Pure Functions** (แนะนำ) - สำหรับนำไปใช้ที่อื่น ดูที่ [USAGE.md](./USAGE.md)
> 2. **ใช้ UI Components** - สำหรับ Demo เท่านั้น (ด้านล่าง)

### วิธีที่ 1: ใช้ Pure Functions (แนะนำสำหรับ Production)

```typescript
import { hasPermission, filterDocumentsByPermission } from "./utils/permission-checker";

// ใช้ใน Service Layer
class DocumentService {
  async create(user, data) {
    if (!hasPermission(user, "procurement", "purchase_request", "create")) {
      throw new Error("No permission");
    }
    return api.post("/documents", data);
  }
}

// ใช้ใน Component
function MyComponent({ user, userId, documents }) {
  const visibleDocs = filterDocumentsByPermission(
    documents,
    user,
    "procurement",
    "purchase_request",
    userId
  );

  const canCreate = hasPermission(user, "procurement", "purchase_request", "create");

  return (
    <>
      <button disabled={!canCreate}>Create</button>
      {visibleDocs.map(doc => <div key={doc.id}>{doc.title}</div>)}
    </>
  );
}
```

**ดูตัวอย่างเพิ่มเติม**: [USAGE.md](./USAGE.md)

### วิธีที่ 2: ใช้ UI Components (Demo Only)

#### 1. เพิ่มหน้าใหม่

```typescript
// app/[locale]/(root)/playground/permission/your-module/page.tsx
"use client";

import { PermissionDemo } from "../components/PermissionDemo";
import { yourDocs } from "../data/mock-data";

export default function YourPage() {
  return (
    <PermissionDemo
      title="Your Page Title"
      createButtonLabel="Create Item"
      module="your_module"
      submodule="your_submodule"
      documents={yourDocs}
      actionButtons={[
        {
          label: "Edit",
          permission: "update",
          variant: "outline",
          onClick: (doc) => console.log("Edit", doc.id),
        },
        // เพิ่มปุ่มอื่นๆ ตามต้องการ
      ]}
    />
  );
}
```

### 2. เพิ่มข้อมูล Mock

แก้ไข `data/mock-data.ts`:

```typescript
export const yourDocs: YourDocumentType[] = [
  { id: "1", title: "Document 1", status: "pending", ownerId: "1" },
  // ...
];
```

### 3. เพิ่ม Permission ให้ผู้ใช้

แก้ไข `usersPermissionTest` ใน `data/mock-data.ts`:

```typescript
{
  id: "1",
  name: "Alice",
  permissions: {
    your_module: {
      your_submodule: ["view_all", "create", "update", "delete"],
    },
  },
}
```

## 🎨 การ Customize

### Custom Document Details

```typescript
<PermissionDemo
  // ... props อื่นๆ
  renderDocumentDetails={(doc) => (
    <div>
      <p className="text-sm font-semibold">Custom Field</p>
      <p className="text-sm">{doc.customField}</p>
    </div>
  )}
/>
```

### Custom Status Badge Colors

```typescript
<PermissionDemo
  // ... props อื่นๆ
  getStatusVariant={(status) => {
    if (status === "completed") return "success";
    if (status === "failed") return "destructive";
    return "default";
  }}
/>
```

## 📊 Permission Matrix

| Role      | view_all | view | create | update | delete | approve | reject | submit |
|-----------|----------|------|--------|--------|--------|---------|--------|--------|
| admin     | ✅       | ✅   | ✅     | ✅     | ✅     | ✅      | ✅     | ✅     |
| header    | ✅       | ✅   | ✅     | ✅     | ❌     | ✅      | ✅     | ❌     |
| approver  | ❌       | ✅   | ❌     | ❌     | ❌     | ✅      | ✅     | ❌     |
| requester | ❌       | ✅   | ✅     | ✅     | ❌     | ❌      | ❌     | ✅     |
| guest     | ❌       | ✅   | ❌     | ❌     | ❌     | ❌      | ❌     | ❌     |

## 🔧 Technical Stack

- **React**: UI Framework
- **TypeScript**: Type Safety
- **Shadcn/ui**: UI Components (Button, Card, Dialog, Badge, Select)
- **Custom Hooks**: Permission Logic
- **Generic Components**: Reusability

## 📈 Code Metrics

### Before Refactoring
- PR Page: ~207 lines
- PO Page: ~209 lines
- DP Page: ~161 lines
- **Total**: ~577 lines
- **Code Duplication**: ~90%

### After Refactoring
- PR Page: ~54 lines (-74%)
- PO Page: ~54 lines (-74%)
- DP Page: ~30 lines (-81%)
- PermissionDemo Component: ~150 lines (reusable)
- **Total**: ~288 lines
- **Code Duplication**: ~0%
- **Code Reduction**: ~50%

## 🎯 Best Practices

### สำหรับ Production Code

1. **ใช้ Pure Functions จาก utils/permission-checker.ts**
   ```typescript
   // ✅ Good - ใช้ pure function
   import { hasPermission } from "./utils/permission-checker";
   if (hasPermission(user, "procurement", "pr", "create")) {
     // do something
   }

   // ❌ Bad - ผูกกับ React (ถ้าไม่จำเป็น)
   const { canCreate } = useModulePermissions(...);
   ```

2. **Validate Permission ทั้ง Client และ Server**
   ```typescript
   // Client-side (UX)
   if (!hasPermission(user, "procurement", "pr", "delete")) {
     return; // ป้องกัน UX
   }

   // Server-side (Security) - ต้องมี!
   if (!hasPermission(user, "procurement", "pr", "delete")) {
     return res.status(403).json({ error: "Forbidden" });
   }
   ```

3. **Single Source of Truth**: ข้อมูล mock อยู่ที่ `data/mock-data.ts` เท่านั้น

4. **Type Safety**: ใช้ TypeScript types จาก `types/permission.types.ts`

5. **Separation of Concerns**:
   - Logic → `utils/` (pure functions)
   - React → `hooks/` (wrappers)
   - UI → `components/` (optional)
   - Data → `data/` (mock)

6. **Consistent Naming**: ใช้ lowercase และ underscore สำหรับ permission names

## 🔍 การทดสอบ

### Test Cases

1. **Admin (Alice)**
   - ควรเห็นเอกสารทั้งหมด (10 รายการ)
   - ควรเห็นปุ่มทุกปุ่ม

2. **Approver (Charlie)**
   - ควรเห็นเฉพาะเอกสารของตัวเอง
   - ควรเห็นเฉพาะปุ่ม Approve, Reject, Send Back

3. **Guest (Eve)**
   - ควรเห็นเฉพาะเอกสารของตัวเอง
   - ไม่ควรเห็นปุ่มใดๆ ใน dialog
   - ปุ่ม Create ควร disabled

4. **Delivery Point (All Users)**
   - ทุกคนควรเห็นเอกสารทั้งหมด (ไม่มี ownerId)
   - ปุ่มแสดงตาม permission ของแต่ละคน

## 📚 เอกสารเพิ่มเติม

- **[USAGE.md](./USAGE.md)** - คู่มือการใช้งาน Pure Functions พร้อมตัวอย่างครบถ้วน
  - ใช้ใน Service Layer
  - ใช้ใน Middleware/Guards
  - ใช้กับ UI Libraries ต่างๆ (Material-UI, Ant Design, Chakra)
  - Performance Tips
  - Security Best Practices

## 🚧 Future Improvements

- [x] แยก Pure Functions ออกจาก UI
- [x] เพิ่ม TypeScript types ครบถ้วน
- [x] Organize mock data
- [x] สร้างเอกสารการใช้งาน
- [ ] เพิ่ม Context Provider สำหรับ global permission state
- [ ] เพิ่ม API integration แทน mock data
- [ ] เพิ่ม unit tests
- [ ] เพิ่ม loading states
- [ ] เพิ่ม error handling
- [ ] เพิ่ม pagination สำหรับข้อมูลเยอะ
- [ ] เพิ่ม search/filter functionality
- [ ] เพิ่ม audit log สำหรับ action ต่างๆ

## 📝 Notes

### สำหรับ Demo
- ระบบนี้เป็น Demo เท่านั้น ยังไม่ได้เชื่อมต่อกับ API จริง
- ข้อมูล permission และ documents เป็น mock data
- การ alert ในปุ่มควรเปลี่ยนเป็นการเรียก API จริงในระบบ production

### สำหรับ Production
- ✅ **Pure functions** ใน `utils/permission-checker.ts` พร้อมใช้งานจริง
- ✅ สามารถนำไปใช้ใน API, Middleware, Service Layer ได้เลย
- ✅ Type-safe ด้วย TypeScript
- ⚠️ ต้อง validate permission ที่ server-side เสมอ (client-side เป็นแค่ UX)
