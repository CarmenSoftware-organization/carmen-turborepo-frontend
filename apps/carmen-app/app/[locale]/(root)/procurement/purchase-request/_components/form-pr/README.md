# Purchase Request Form Components

## Architecture Overview

```
form-pr/
├── MainForm.tsx                    # Main orchestrator (430 lines)
├── PurchaseItemDataGrid.tsx        # Table container (299 lines)
├── ActionButton.tsx                # Reusable button component
├── columns/
│   └── PurchaseItemColumns.tsx     # Column definitions (465 lines)
├── dialogs/
│   ├── BulkActionDialog.tsx        # Bulk review/reject dialog
│   └── SelectAllDialog.tsx         # Select all/pending dialog
└── ExpandedContent.tsx             # Row expansion content
```

## Component Responsibilities

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `MainForm` | Form orchestration, state management, API calls | `currentFormType`, `prId` |
| `PurchaseItemDataGrid` | Table UI, selection, bulk actions | `items`, `onItemUpdate`, `onItemRemove` |
| `PurchaseItemColumns` | Column definitions factory | Config object with callbacks |
| `ExpandedContent` | Vendor info, inventory, dimensions | `item`, `getItemValue` |
| `BulkActionDialog` | Review/reject message input | `bulkActionType`, `onConfirm` |
| `SelectAllDialog` | All/pending selection | `items`, `table`, `getCurrentStatus` |

## Custom Hooks

### `usePurchaseItemManagement`
```typescript
// Manages add/update/remove arrays for backend
const { items, addItem, updateItem, removeItem, getItemValue } =
  usePurchaseItemManagement({ form, initValues });
```

### `usePurchaseItemTable`
```typescript
// Manages table state (dialogs, sorting, selection)
const {
  deleteDialogOpen, handleRemoveItemClick,
  bulkActionDialogOpen, handleBulkActionClick,
  selectAllDialogOpen, sorting, setSorting
} = usePurchaseItemTable({ onItemUpdate, onItemRemove, getItemValue });
```

### `usePrActions`
```typescript
// PR workflow actions with loading/error states
const { save, submit, approve, reject, review, sendBack, isPending } =
  usePrActions(token, buCode, prId);
```

## Data Flow

```
MainForm (form state)
    ↓
PurchaseItemDataGrid (items array)
    ↓
createPurchaseItemColumns (column definitions)
    ↓
Table cells (LocationLookup, ProductLookup, etc.)
    ↓
onItemUpdate callback
    ↓
usePurchaseItemManagement (update form state)
```

## Form State Structure

```typescript
{
  details: {
    purchase_request_detail: {
      add: [],      // New items (nanoid)
      update: [],   // Modified existing items
      remove: []    // Deleted items (id only)
    }
  }
}
```

## Bulk Actions

| Action | Requires Message | Updates |
|--------|-----------------|---------|
| Approve | ❌ | `stages_status` array |
| Review | ✅ | `stages_status` array + message |
| Reject | ✅ | `stages_status` array + message |

```typescript
// Bulk action flow
1. User selects rows → table.getFilteredSelectedRowModel()
2. Click action button → handleBulkActionClick(action)
3. If review/reject → show BulkActionDialog
4. Confirm → performBulkStatusUpdate(status, message)
5. Update all selected items' stages_status
```

## Column Visibility Logic

| Form Type | Columns Hidden |
|-----------|---------------|
| VIEW | `select`, `action` |
| prStatus !== 'in_progress' | `select`, `stage_status`, `approved_qty`, `total_price` |

## Key Features

- **Expandable rows**: Vendor pricing, inventory info, dimensions
- **Smart selection**: Select all or pending-only items
- **Inline editing**: Location, product, quantities, dates
- **Real-time validation**: React Hook Form + Zod
- **Optimistic updates**: Form state updates before API
- **Error handling**: Centralized via `useErrorHandler`

## Performance Optimizations

- `useMemo` for column definitions (15 dependencies)
- `useCallback` for event handlers
- `queueMicrotask` for validation (replaces setTimeout)
- Memoized `items` array in `usePurchaseItemManagement`

## Common Patterns

### Adding New Item
```typescript
onAddItem() → prepend to addFields → form.trigger()
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

## Validation Strategy

- Draft status: `approved_unit_id`, `foc_unit_id`, `stages_status` are nullable
- In-progress: Full validation applies
- Per-field validation on change
- Full form validation on submit
