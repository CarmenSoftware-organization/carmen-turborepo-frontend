# Purchase Request Form Components

## Architecture Overview

```
purchase-request/
├── _components/
│   └── form-pr/
│       ├── MainForm.tsx                # Main orchestrator
│       ├── PurchaseItemDataGrid.tsx    # Table container
│       ├── ActionButtons.tsx           # Action button group
│       ├── ActionFields.tsx            # Form fields
│       ├── HeadForm.tsx                # Header form section
│       ├── WorkflowHistory.tsx         # Workflow history display
│       ├── columns/
│       │   └── PurchaseItemColumns.tsx # Column definitions
│       └── dialogs/
│           ├── BulkActionDialog.tsx    # Bulk review/reject dialog
│           ├── SelectAllDialog.tsx     # Select all/pending dialog
│           ├── ReviewStageDialog.tsx   # Review stage selection
│           └── CancelConfirmDialog.tsx # Cancel confirmation
├── _hooks/
│   ├── use-pr-actions.ts               # Mutation hooks for workflow actions
│   ├── use-purchase-item-management.ts # Form array management
│   ├── use-purchase-item-table.ts      # Table state & dialogs
│   ├── use-prev-workflow.ts            # Fetch workflow stages
│   ├── use-debounce.ts                 # Debounce utility
│   └── use-error-handler.ts            # Error handling
├── _handlers/
│   ├── purchase-request-create.handlers.ts  # CREATE logic
│   ├── purchase-request-update.handlers.ts  # UPDATE logic
│   └── purchase-request-actions.handlers.ts # Workflow actions
├── _utils/
│   ├── object.utils.ts                 # Generic object utilities
│   ├── purchase-request.utils.ts       # PR-specific utilities
│   └── stage.utils.ts                  # Stage/workflow utilities
├── _constants/
│   └── purchase-request.constants.ts   # Field constants
└── _schemas/
    └── purchase-request-form.schema.ts # Zod validation schemas
```

## Layer Architecture

### **1. Presentation Layer** (`_components/`)
- **Responsibility**: UI rendering, user interaction
- **Pattern**: React components with controlled inputs
- **Example**: `MainForm.tsx`, `PurchaseItemDataGrid.tsx`

### **2. Business Logic Layer** (`_handlers/`)
- **Responsibility**: Data preparation, success/error handling
- **Pattern**: Pure functions with clear inputs/outputs
- **Max Complexity**: 5 per function
- **Example**:
  ```typescript
  createPurchaseRequest(data, mutation, router, tPR, toastSuccess, toastError)
  ```

### **3. Data Access Layer** (`_hooks/`)
- **Responsibility**: API calls, React Query state management
- **Pattern**: Custom React hooks
- **Example**:
  ```typescript
  const { save, submit, reject, isPending } = usePrActions(token, buCode, prId);
  ```

### **4. Utility Layer** (`_utils/`)
- **Responsibility**: Reusable helper functions
- **Pattern**: Pure functions, immutable transformations
- **Max Complexity**: 5 per function
- **Example**:
  ```typescript
  const cleaned = removeEmptyFields(data);
  const converted = convertFieldsToNumbers(data, QUANTITY_FIELDS);
  ```

---

## Component Responsibilities

| Component | Purpose | Key Props | Complexity |
|-----------|---------|-----------|------------|
| `MainForm` | Form orchestration, state management | `mode`, `initValues` | Reduced from ~15 to 2 |
| `PurchaseItemDataGrid` | Table UI, selection, bulk actions | `items`, `onItemUpdate` | Low |
| `PurchaseItemColumns` | Column definitions factory | Config callbacks | Medium |
| `ActionButtons` | Workflow action buttons | `onSubmit`, `onReject` | Low |
| `BulkActionDialog` | Review/reject message input | `bulkActionType`, `onConfirm` | Low |
| `SelectAllDialog` | All/pending selection | `items`, `table` | Low |
| `ReviewStageDialog` | Stage selection with loading | `stages`, `isLoading` | Low |
| `CancelConfirmDialog` | Cancel confirmation | `onConfirm` | Low |

---

## Custom Hooks

### `usePurchaseItemManagement`
```typescript
// Manages add/update/remove arrays for React Hook Form
const {
  items,              // Merged array of all items
  addItem,            // Add new item
  updateItem,         // Update existing/new item
  removeItem,         // Remove item (soft delete)
  getItemValue        // Get field value from item
} = usePurchaseItemManagement({ form, initValues });
```

**Purpose**: Form array management with add/update/remove tracking

---

### `usePurchaseItemTable`
```typescript
// Manages table state (dialogs, sorting, selection)
const {
  deleteDialogOpen, setDeleteDialogOpen,
  handleRemoveItemClick, handleConfirmDelete,
  selectAllDialogOpen, setSelectAllDialogOpen,
  bulkActionDialogOpen, setBulkActionDialogOpen,
  bulkActionType, bulkActionMessage,
  sorting, setSorting,
  handleBulkActionClick
} = usePurchaseItemTable({ onItemUpdate, onItemRemove, getItemValue });
```

**Purpose**: Centralized table state and dialog management

---

### `usePrActions`
```typescript
// PR workflow actions with loading/error states
const {
  save, submit, approve, reject, review, sendBack, purchase,
  isPending,          // Any action loading
  loadingStates,      // Individual loading states
  isError,            // Any action error
  errors              // Individual error states
} = usePrActions(token, buCode, prId);
```

**Purpose**: React Query mutations for all workflow actions

---

### `usePrevWorkflow`
```typescript
// Fetch previous workflow stages for review
const {
  data: stages,       // Array of stage names
  isLoading
} = usePrevWorkflow({ token, buCode, workflow_id, stage, enabled });
```

**Purpose**: Load available review stages from workflow definition

---

## Handler Functions (Reduced Complexity)

### Create Handlers
```typescript
// purchase-request-create.handlers.ts
handleCreateSuccess(responseData, router, tPR, toastSuccess)  // Complexity: 2
handleCreateError(error, tPR, toastError)                     // Complexity: 1
createPurchaseRequest(data, createPr, router, ...)            // Complexity: 1
```

### Update Handlers
```typescript
// purchase-request-update.handlers.ts
handleUpdateSuccess(queryClient, buCode, prId, ...)           // Complexity: 1
handleUpdateError(error, tPR, toastError)                     // Complexity: 1
updatePurchaseRequest(data, save, queryClient, ...)           // Complexity: 1
```

### Action Handlers
```typescript
// purchase-request-actions.handlers.ts
submitPurchaseRequest(details, submit, queryClient, ...)      // Complexity: 2
rejectPurchaseRequest(details, reject, queryClient, ...)      // Complexity: 2
sendBackPurchaseRequest(details, sendBack, queryClient, ...)  // Complexity: 2
```

---

## Utility Functions

### Object Utilities
```typescript
// object.utils.ts
shouldRemoveValue(value)                // Check if null/undefined/empty
removeEmptyFields(obj)                  // Remove falsy fields
convertFieldsToNumbers(obj, fields)     // Convert specified fields to numbers
```

### Purchase Request Utilities
```typescript
// purchase-request.utils.ts
cleanPurchaseRequestDetail(item)        // Clean & convert single item
hasPurchaseRequestDetails(data)         // Check if has items to process
processPurchaseRequestDetails(details)  // Process all items
prepareSubmitData(data)                 // Main data preparation (Complexity: 3)
```

### Stage Utilities
```typescript
// stage.utils.ts
getLastStageMessage(stagesStatusValue)  // Extract last message from array
createStageDetail(id, status, msg, default) // Create stage detail object
```

---

## Data Flow

### **Form Submission Flow**
```
User submits form
    ↓
MainForm.handleSubmit (Complexity: 2)
    ↓
prepareSubmitData (clean & validate)
    ↓
createPurchaseRequest / updatePurchaseRequest
    ↓
usePrActions.createPr / save mutation
    ↓
API call (TanStack Query)
    ↓
handleSuccess / handleError
    ↓
Toast notification + Query invalidation
```

### **Workflow Action Flow**
```
User clicks Submit/Reject/SendBack
    ↓
onSubmitPr / onReject / onSendBack
    ↓
Map items → create stage details
    ↓
getLastStageMessage + createStageDetail
    ↓
submitPurchaseRequest / rejectPurchaseRequest
    ↓
usePrActions.submit / reject mutation
    ↓
API call
    ↓
handleActionSuccess / handleActionError
    ↓
Toast + Invalidate queries
```

### **Item Management Flow**
```
User edits cell
    ↓
onItemUpdate(itemId, fieldName, value)
    ↓
usePurchaseItemManagement
    ↓
Is new item?
  ├─ Yes → Update addFields array
  └─ No  → Add to updateItems array
    ↓
form.setValue()
    ↓
Trigger validation
```

---

## Form State Structure

```typescript
{
  // Main fields
  pr_date: "2024-01-01",
  delivery_point_id: "uuid",
  delivery_date: "2024-01-15",
  workflow_id: "uuid",
  description: "...",
  note: "...",

  // Details (managed by usePurchaseItemManagement)
  details: {
    purchase_request_detail: {
      add: [           // New items (nanoid)
        { id: "nano_xxx", product_id: "...", requested_qty: 10, ... }
      ],
      update: [        // Modified existing items
        { id: "uuid", requested_qty: 15, ... }
      ],
      remove: [        // Deleted items (id only)
        { id: "uuid" }
      ]
    }
  }
}
```

---

## Workflow Actions

| Action | Button | Handler | Success Message | Error Message |
|--------|--------|---------|-----------------|---------------|
| Save | Save Draft | `updatePurchaseRequest` | `purchase_request_updated` | `purchase_request_updated_failed` |
| Submit | Submit | `submitPurchaseRequest` | `purchase_request_submitted` | `purchase_request_submitted_failed` |
| Approve | Approve | Direct mutation | `purchase_request_approved` | `purchase_request_approved_failed` |
| Reject | Reject | `rejectPurchaseRequest` | `purchase_request_rejected` | `purchase_request_rejected_failed` |
| Send Back | Send Back | `sendBackPurchaseRequest` | `purchase_request_sent_back` | `purchase_request_sent_back_failed` |
| Review | Review | Review handler | `purchase_request_reviewed` | `purchase_request_reviewed_failed` |
| Purchase | Purchase | Direct mutation | `purchase_request_approved_purchase` | `purchase_request_approved_purchase_failed` |

---

## Bulk Actions

| Action | Requires Message | Dialog | Updates |
|--------|------------------|--------|---------|
| Approve | ❌ | None | `stages_status` array |
| Review | ✅ | `BulkActionDialog` | `stages_status` + message |
| Reject | ✅ | `BulkActionDialog` | `stages_status` + message |

### Bulk Action Flow
```typescript
1. User selects rows → table.getFilteredSelectedRowModel()
2. Click action button → handleBulkActionClick(PR_ITEM_BULK_ACTION.REVIEW)
3. Show BulkActionDialog (if review/reject)
4. User enters message + confirms
5. performBulkStatusUpdate(status, message)
6. Update all selected items' stages_status array
7. Call form.trigger() for validation
```

---

## Column Visibility Logic

| Form Type | Hidden Columns |
|-----------|---------------|
| VIEW | `select`, `action` |
| prStatus !== 'in_progress' | `select`, `stage_status`, `approved_qty`, `total_price` |

---

## Validation Strategy

- **Draft status**: `approved_unit_id`, `foc_unit_id`, `stages_status` are nullable
- **In-progress**: Full validation applies
- **Per-field validation**: On change using `form.trigger()`
- **Full form validation**: On submit
- **Required fields**: `delivery_point_id`, `delivery_date` (since refactor)

---

## Performance Optimizations

- ✅ `useMemo` for column definitions (12+ dependencies)
- ✅ `useCallback` for event handlers
- ✅ `queueMicrotask` for validation (replaces setTimeout)
- ✅ Memoized `items` array in `usePurchaseItemManagement`
- ✅ Arrow functions for all utilities/handlers
- ✅ Complexity reduced from ~15 to 2-5 per function

---

## Code Quality Improvements

### Before Refactor
```typescript
const handleSubmit = (data) => {
  // 50+ lines
  // Complexity: ~15
  // Nested conditions
  // Inline data transformation
  // Repeated logic
}
```

### After Refactor
```typescript
// MainForm.tsx (Complexity: 2)
const handleSubmit = (data: CreatePrDto): void => {
  const processedData = prepareSubmitData(data);
  const isCreating = currentFormType === formType.ADD;

  if (isCreating) {
    createPurchaseRequest(processedData, createPr, router, tPR, toastSuccess, toastError);
  } else {
    updatePurchaseRequest(processedData, save, queryClient, buCode, prId, ...);
  }
};
```

**Benefits:**
- ✅ Single Responsibility Principle
- ✅ DRY (Don't Repeat Yourself)
- ✅ Testability (unit test each function)
- ✅ Maintainability (change in one place)
- ✅ Reusability (utilities used across components)
- ✅ Type Safety (TypeScript strict mode)

---

## Common Patterns

### Adding New Item
```typescript
onAddItem()
  → prepend to addFields
  → form.trigger()
```

### Updating Item
```typescript
// New item: update addFields array
// Existing item: add to updateItems + state.updatedItems
onItemUpdate(itemId, fieldName, value, selectedProduct?)
```

### Removing Item
```typescript
// New item: remove from addFields
// Existing item: add to removeItems + hide from UI
onItemRemove(itemId, isNewItem, itemIndex?)
```

### Workflow Action
```typescript
// 1. Prepare details
const details = items.map(item => {
  const stageMessage = getLastStageMessage(item.stages_status);
  return createStageDetail(item.id, "submit", stageMessage, "default");
});

// 2. Call handler
submitPurchaseRequest(details, submit, queryClient, buCode, prId, tPR, toastSuccess, toastError);
```

---

## Testing Recommendations

### Unit Tests
- `object.utils.ts` - Test each utility function
- `purchase-request.utils.ts` - Test data preparation
- `stage.utils.ts` - Test stage message extraction

### Integration Tests
- Form submission flow (create/update)
- Workflow actions (submit/reject/sendBack)
- Item management (add/update/remove)

### E2E Tests
- Complete PR creation workflow
- Approval/rejection flow
- Bulk actions

---

## Migration Notes

If you're updating from the old architecture:

1. ✅ Replace inline logic with utility functions
2. ✅ Use handlers for all mutations
3. ✅ Convert all functions to arrow functions
4. ✅ Keep complexity ≤ 5 per function
5. ✅ Use immutable data transformations
6. ✅ Add JSDoc comments for all exports

---

## Future Improvements

- [ ] Add unit tests for all utilities
- [ ] Extract toast logic to separate utility
- [ ] Create custom Error types
- [ ] Add retry logic for failed mutations
- [ ] Implement optimistic updates
- [ ] Add loading skeletons for better UX
