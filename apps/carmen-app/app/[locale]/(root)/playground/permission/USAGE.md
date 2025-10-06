# Permission System - Usage Guide

คู่มือการใช้งาน Permission System ที่แยก logic ออกจาก UI เพื่อความยืดหยุ่นในการนำไปใช้ในที่อื่น

## 🎯 Architecture

```
utils/permission-checker.ts  ← Pure functions (ไม่ผูกกับ UI)
      ↓
hooks/usePermission.ts       ← React Hook wrapper (สำหรับ React components)
      ↓
components/PermissionDemo.tsx ← UI Component (Optional)
```

## 📦 Core Utilities (Pure Functions)

ใช้ได้ทุกที่ ไม่จำเป็นต้องอยู่ใน React component

### 1. hasPermission()

ตรวจสอบว่า user มี permission หรือไม่

```typescript
import { hasPermission } from "./utils/permission-checker";

// ตรวจสอบ permission เดี่ยว
const canCreate = hasPermission(user, "procurement", "purchase_request", "create");
// return: true | false

// ใช้ใน if statement
if (hasPermission(user, "procurement", "purchase_order", "approve")) {
  // show approve button
}

// ใช้ใน disabled attribute
<button disabled={!hasPermission(user, "configuration", "delivery_point", "update")}>
  Edit
</button>
```

### 2. filterDocumentsByPermission()

กรองเอกสารตาม view permission

```typescript
import { filterDocumentsByPermission } from "./utils/permission-checker";

const allDocuments = [
  { id: "1", title: "Doc 1", ownerId: "user-1" },
  { id: "2", title: "Doc 2", ownerId: "user-2" },
  { id: "3", title: "Doc 3", ownerId: "user-1" },
];

const visibleDocs = filterDocumentsByPermission(
  allDocuments,
  currentUser,
  "procurement",
  "purchase_request",
  "user-1"
);
// return: เฉพาะเอกสารที่ user มีสิทธิ์เห็น
```

**Logic:**
- `view_all` → เห็นทั้งหมด
- `view` + มี `ownerId` → เห็นเฉพาะของตัวเอง
- `view` + ไม่มี `ownerId` → เห็นทั้งหมด (configuration data)

### 3. getModulePermissions()

ดึง permission ทั้งหมดของ module

```typescript
import { getModulePermissions } from "./utils/permission-checker";

const permissions = getModulePermissions(user, "procurement", "purchase_request");
// return: ["view_all", "create", "update", "delete"]

// แสดงเป็น text
<p>Permissions: {permissions.join(", ")}</p>
```

### 4. checkPermissions()

ตรวจสอบหลาย permission พร้อมกัน

```typescript
import { checkPermissions } from "./utils/permission-checker";

const perms = checkPermissions(
  user,
  "procurement",
  "purchase_request",
  ["create", "update", "delete", "approve"]
);
// return: {
//   create: true,
//   update: true,
//   delete: false,
//   approve: false
// }

// ใช้งาน
if (perms.create) {
  // show create button
}
```

### 5. getPermissionFlags()

ดึง permission flags ทั้งหมด

```typescript
import { getPermissionFlags } from "./utils/permission-checker";

const flags = getPermissionFlags(user, "procurement", "purchase_request");
// return: {
//   canViewAll: true,
//   canViewDp: false,
//   canView: true,
//   canCreate: true,
//   canUpdate: true,
//   canDelete: false,
//   canApprove: false,
//   canReject: false,
//   canSendBack: false,
//   canSubmit: true
// }

// ใช้งาน
<button disabled={!flags.canCreate}>Create</button>
<button disabled={!flags.canUpdate}>Edit</button>
<button disabled={!flags.canDelete}>Delete</button>
```

### 6. canPerformAction()

ตรวจสอบว่าสามารถทำ action กับเอกสารนั้นได้หรือไม่

```typescript
import { canPerformAction } from "./utils/permission-checker";

const document = { id: "pr-001", ownerId: "user-2" };

const canEdit = canPerformAction(
  user,
  "procurement",
  "purchase_request",
  "update",
  document,
  "user-1"
);
// return: false (ไม่ใช่เจ้าของและไม่มี view_all)

// ใช้ใน button
<button
  disabled={!canPerformAction(user, "procurement", "purchase_request", "delete", doc, userId)}
  onClick={() => deleteDocument(doc)}
>
  Delete
</button>
```

## ⚛️ React Hook (สำหรับ React Components)

```typescript
import { useModulePermissions } from "./hooks/usePermission";

function MyComponent() {
  const { hasPermission, filterDocuments, canCreate, canUpdate, canDelete } =
    useModulePermissions(user, "procurement", "purchase_request", userId);

  const visibleDocs = filterDocuments(allDocuments);

  return (
    <div>
      <button disabled={!canCreate}>Create</button>

      {visibleDocs.map((doc) => (
        <div key={doc.id}>
          <h3>{doc.title}</h3>
          {canUpdate && <button>Edit</button>}
          {canDelete && <button>Delete</button>}
          {hasPermission("approve") && <button>Approve</button>}
        </div>
      ))}
    </div>
  );
}
```

## 🔌 ตัวอย่างการใช้งานจริง

### 1. ใช้ในหน้า List (Table/Grid)

```typescript
import { filterDocumentsByPermission } from "./utils/permission-checker";

function PurchaseRequestList({ user, userId }) {
  const [documents] = useState(allDocuments);

  // กรองเอกสาร
  const visibleDocs = filterDocumentsByPermission(
    documents,
    user,
    "procurement",
    "purchase_request",
    userId
  );

  return (
    <div>
      <h1>Purchase Requests ({visibleDocs.length})</h1>
      <table>
        <tbody>
          {visibleDocs.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.id}</td>
              <td>{doc.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 2. ใช้ใน API/Service Layer

```typescript
import { hasPermission, canPerformAction } from "./utils/permission-checker";

class PurchaseRequestService {
  async create(user, data) {
    // ตรวจสอบ permission ก่อนเรียก API
    if (!hasPermission(user, "procurement", "purchase_request", "create")) {
      throw new Error("No permission to create");
    }

    return api.post("/purchase-requests", data);
  }

  async update(user, userId, documentId, data) {
    const document = await this.get(documentId);

    // ตรวจสอบว่าสามารถแก้ไขเอกสารนี้ได้หรือไม่
    if (!canPerformAction(user, "procurement", "purchase_request", "update", document, userId)) {
      throw new Error("No permission to update this document");
    }

    return api.put(`/purchase-requests/${documentId}`, data);
  }

  async delete(user, userId, documentId) {
    const document = await this.get(documentId);

    if (!canPerformAction(user, "procurement", "purchase_request", "delete", document, userId)) {
      throw new Error("No permission to delete this document");
    }

    return api.delete(`/purchase-requests/${documentId}`);
  }
}
```

### 3. ใช้ใน Middleware/Guard

```typescript
import { hasPermission } from "./utils/permission-checker";

// Next.js middleware
export function withPermission(module, submodule, action) {
  return function middleware(handler) {
    return async (req, res) => {
      const user = req.user;

      if (!hasPermission(user, module, submodule, action)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      return handler(req, res);
    };
  };
}

// ใช้งาน
export default withPermission("procurement", "purchase_request", "create")(
  async (req, res) => {
    // handle create
  }
);
```

### 4. ใช้ใน Route Protection

```typescript
import { hasPermission } from "./utils/permission-checker";

function ProtectedRoute({ user, module, submodule, action, children }) {
  if (!hasPermission(user, module, submodule, action)) {
    return <Navigate to="/forbidden" />;
  }

  return children;
}

// ใช้งาน
<ProtectedRoute
  user={user}
  module="procurement"
  submodule="purchase_request"
  action="view"
>
  <PurchaseRequestPage />
</ProtectedRoute>
```

### 5. ใช้ใน Form Validation

```typescript
import { hasPermission } from "./utils/permission-checker";

function PurchaseRequestForm({ user, document }) {
  const canEdit = document
    ? hasPermission(user, "procurement", "purchase_request", "update")
    : hasPermission(user, "procurement", "purchase_request", "create");

  if (!canEdit) {
    return <div>You don't have permission to edit this form.</div>;
  }

  return (
    <form>
      {/* form fields */}
    </form>
  );
}
```

### 6. ใช้ใน Menu/Navigation

```typescript
import { hasPermission, getPermissionFlags } from "./utils/permission-checker";

function Navigation({ user }) {
  const prFlags = getPermissionFlags(user, "procurement", "purchase_request");
  const poFlags = getPermissionFlags(user, "procurement", "purchase_order");

  return (
    <nav>
      {(prFlags.canView || prFlags.canViewAll) && (
        <Link to="/procurement/pr">Purchase Requests</Link>
      )}

      {(poFlags.canView || poFlags.canViewAll) && (
        <Link to="/procurement/po">Purchase Orders</Link>
      )}

      {hasPermission(user, "configuration", "delivery_point", "view") && (
        <Link to="/configuration/delivery-point">Delivery Points</Link>
      )}
    </nav>
  );
}
```

### 7. ใช้ใน Context Menu/Actions

```typescript
import { canPerformAction } from "./utils/permission-checker";

function DocumentContextMenu({ user, userId, document }) {
  const actions = [
    {
      label: "View",
      action: "view",
      onClick: () => viewDocument(document),
    },
    {
      label: "Edit",
      action: "update",
      onClick: () => editDocument(document),
    },
    {
      label: "Delete",
      action: "delete",
      onClick: () => deleteDocument(document),
    },
    {
      label: "Approve",
      action: "approve",
      onClick: () => approveDocument(document),
    },
  ];

  const visibleActions = actions.filter((item) =>
    canPerformAction(
      user,
      "procurement",
      "purchase_request",
      item.action,
      document,
      userId
    )
  );

  return (
    <Menu>
      {visibleActions.map((item) => (
        <MenuItem key={item.label} onClick={item.onClick}>
          {item.label}
        </MenuItem>
      ))}
    </Menu>
  );
}
```

## 🎨 ใช้กับ UI Libraries อื่นๆ

### Material-UI

```typescript
import { getPermissionFlags } from "./utils/permission-checker";
import { Button, IconButton } from "@mui/material";
import { Edit, Delete, CheckCircle } from "@mui/icons-material";

function DocumentActions({ user, document }) {
  const flags = getPermissionFlags(user, "procurement", "purchase_request");

  return (
    <Box>
      <IconButton disabled={!flags.canUpdate}>
        <Edit />
      </IconButton>
      <IconButton disabled={!flags.canDelete}>
        <Delete />
      </IconButton>
      <Button
        variant="contained"
        startIcon={<CheckCircle />}
        disabled={!flags.canApprove}
      >
        Approve
      </Button>
    </Box>
  );
}
```

### Ant Design

```typescript
import { hasPermission } from "./utils/permission-checker";
import { Button, Dropdown, Menu } from "antd";

function DocumentActions({ user, document }) {
  const menu = (
    <Menu>
      {hasPermission(user, "procurement", "purchase_request", "update") && (
        <Menu.Item key="edit">Edit</Menu.Item>
      )}
      {hasPermission(user, "procurement", "purchase_request", "delete") && (
        <Menu.Item key="delete" danger>Delete</Menu.Item>
      )}
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <Button>Actions</Button>
    </Dropdown>
  );
}
```

### Chakra UI

```typescript
import { getPermissionFlags } from "./utils/permission-checker";
import { Button, ButtonGroup, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";

function DocumentActions({ user, document }) {
  const flags = getPermissionFlags(user, "procurement", "purchase_request");

  return (
    <ButtonGroup>
      <Button isDisabled={!flags.canUpdate}>Edit</Button>
      <Button isDisabled={!flags.canDelete} colorScheme="red">Delete</Button>
      <Button isDisabled={!flags.canApprove} colorScheme="green">Approve</Button>
    </ButtonGroup>
  );
}
```

## 📊 Performance Tips

### 1. Memoization

```typescript
import { useMemo } from "react";
import { filterDocumentsByPermission, getPermissionFlags } from "./utils/permission-checker";

function MyComponent({ user, userId, documents }) {
  // Cache filtered documents
  const visibleDocs = useMemo(
    () => filterDocumentsByPermission(documents, user, "procurement", "purchase_request", userId),
    [documents, user, userId]
  );

  // Cache permission flags
  const flags = useMemo(
    () => getPermissionFlags(user, "procurement", "purchase_request"),
    [user]
  );

  return (
    // ...
  );
}
```

### 2. Context for User

```typescript
import { createContext, useContext } from "react";

const UserContext = createContext(null);

export function useUser() {
  return useContext(UserContext);
}

// ใช้งาน
function MyComponent() {
  const { user, userId } = useUser();
  const flags = getPermissionFlags(user, "procurement", "purchase_request");
  // ...
}
```

## ✅ Best Practices

1. **ใช้ Pure Functions ใน Logic Layer**
   ```typescript
   // ✅ Good - ใช้ pure function
   if (hasPermission(user, "procurement", "pr", "create")) {
     await createPR(data);
   }

   // ❌ Bad - ผูกกับ React
   const { canCreate } = useModulePermissions(...);
   if (canCreate) {
     await createPR(data);
   }
   ```

2. **ใช้ Hook ใน React Components**
   ```typescript
   // ✅ Good - ใช้ hook ใน component
   function MyComponent() {
     const { canCreate, canUpdate } = useModulePermissions(...);
     return <button disabled={!canCreate}>Create</button>;
   }
   ```

3. **Cache Permission Checks**
   ```typescript
   // ✅ Good - cache ด้วย useMemo
   const flags = useMemo(
     () => getPermissionFlags(user, module, submodule),
     [user, module, submodule]
   );

   // ❌ Bad - เรียกซ้ำทุกครั้ง
   return (
     <>
       <button disabled={!hasPermission(user, module, submodule, "create")}>
       <button disabled={!hasPermission(user, module, submodule, "update")}>
       <button disabled={!hasPermission(user, module, submodule, "delete")}>
     </>
   );
   ```

4. **Validate ทั้ง Client และ Server**
   ```typescript
   // Client-side
   if (!hasPermission(user, "procurement", "pr", "delete")) {
     return; // ไม่ให้ทำ
   }

   // Server-side (API)
   if (!hasPermission(user, "procurement", "pr", "delete")) {
     return res.status(403).json({ error: "Forbidden" });
   }
   ```

## 🔒 Security Notes

- ⚠️ **Client-side permission check เป็นเพียง UX เท่านั้น**
- ✅ **ต้อง validate permission ที่ server-side เสมอ**
- ✅ **ใช้ pure functions เพื่อความ consistent ระหว่าง client/server**
- ✅ **Mock data ใช้สำหรับ development เท่านั้น**

## 📚 Summary

| Use Case | Function | Where to Use |
|----------|----------|--------------|
| Check single permission | `hasPermission()` | Anywhere |
| Check multiple permissions | `checkPermissions()` or `getPermissionFlags()` | Anywhere |
| Filter documents | `filterDocumentsByPermission()` | Anywhere |
| Get all permissions | `getModulePermissions()` | Anywhere |
| Check action on document | `canPerformAction()` | Anywhere |
| React component helper | `useModulePermissions()` | React only |

**Key Point**: ใช้ pure functions จาก `utils/permission-checker.ts` ได้ทุกที่ ไม่จำเป็นต้องใช้ React Hook!
