import { useState, useCallback } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { nanoid } from 'nanoid';
import { PurchaseRequestDetail, CreatePrDto } from '@/dtos/purchase-request.dto';

interface PurchaseItemState {
    updatedItems: Record<string, Partial<PurchaseRequestDetail>>;
    removedItems: Set<string>;
}

interface UsePurchaseItemManagementProps {
    form: UseFormReturn<CreatePrDto>;
    initValues?: PurchaseRequestDetail[];
}

interface UsePurchaseItemManagementReturn {
    // State
    items: PurchaseRequestDetail[];
    updatedItems: Record<string, Partial<PurchaseRequestDetail>>;
    removedItems: Set<string>;

    // Actions
    addItem: () => void;
    updateItem: (itemId: string, fieldName: string, value: any, selectedProduct?: any) => void;
    removeItem: (itemId: string, isNewItem?: boolean, itemIndex?: number) => void;

    // Field array helpers
    addFields: any[];
    appendField: (item: any) => void;
    removeField: (index: number) => void;

    // Helper
    getItemValue: (item: PurchaseRequestDetail, fieldName: string) => any;
}

export const usePurchaseItemManagement = ({
    form,
    initValues = []
}: UsePurchaseItemManagementProps): UsePurchaseItemManagementReturn => {

    // State for tracking updates and deletions
    const [state, setState] = useState<PurchaseItemState>({
        updatedItems: {},
        removedItems: new Set()
    });

    // Field array for new items
    const {
        fields: addFields,
        append: addAppend,
        remove: addRemove,
    } = useFieldArray({
        control: form.control,
        name: "body.purchase_request_detail.add",
    });

    // Combined items (existing + new)
    const items = [
        ...initValues.filter(item => !state.removedItems.has(item.id)),
        ...(addFields as unknown as PurchaseRequestDetail[])
    ];

    // Add new item
    const addItem = useCallback(() => {
        const newItem = {
            id: nanoid(),
            location_id: undefined,
            product_id: undefined,
            inventory_unit_id: undefined,
            description: undefined,
            requested_qty: 0,
            requested_unit_id: undefined,
            delivery_date: undefined,
        };
        addAppend(newItem);

        // Trigger validation after adding item to show errors immediately
        setTimeout(async () => {
            await form.trigger();
        }, 100);
    }, [addAppend, form]);

    // Update item field
    const updateItem = useCallback((
        itemId: string,
        fieldName: string,
        value: any,
        selectedProduct?: any
    ) => {
        // Check if this is a new item (from addFields)
        const isNewItem = addFields.some((field: any) => field.id === itemId);

        if (isNewItem) {
            // Update the form directly for new items
            const fieldIndex = addFields.findIndex((field: any) => field.id === itemId);
            if (fieldIndex >= 0) {
                const currentValues = form.getValues();
                const updatedAddItems = [...(currentValues.body.purchase_request_detail?.add || [])];

                if (updatedAddItems[fieldIndex]) {
                    // Convert string to number for quantity fields
                    let processedValue = value;
                    if (['requested_qty', 'approved_qty', 'foc_qty'].includes(fieldName)) {
                        // Allow 0 as a valid value
                        if (value === undefined || value === null || value === '') {
                            processedValue = 0;
                        } else {
                            processedValue = Number(value);
                        }
                    }

                    // Update only the changed field, keep others unchanged
                    updatedAddItems[fieldIndex] = {
                        ...updatedAddItems[fieldIndex],
                        [fieldName]: processedValue,
                        // Handle product selection
                        ...(selectedProduct && fieldName === 'product_id' ? {
                            product_name: selectedProduct.name,
                            inventory_unit_id: selectedProduct.inventory_unit_id,
                            inventory_unit_name: selectedProduct.inventory_unit_name,
                        } : {})
                    };

                    form.setValue('body.purchase_request_detail.add', updatedAddItems, {
                        shouldValidate: false,
                        shouldDirty: true,
                        shouldTouch: true
                    });

                    // Clear and re-trigger validation to ensure errors are updated
                    setTimeout(async () => {
                        form.clearErrors();
                        await form.trigger();
                    }, 50);
                }
            }
        } else {
            // Update existing items
            const currentValues = form.getValues();

            // Check if form supports update array
            const hasUpdateField = currentValues.body.purchase_request_detail && 'update' in currentValues.body.purchase_request_detail;

            if (hasUpdateField) {
                // Use update array for forms that support it
                const updateItems = currentValues.body.purchase_request_detail?.update || [];

                // Find existing update item or create new one
                let existingUpdateIndex = updateItems.findIndex((updateItem: any) => updateItem.id === itemId);

                if (existingUpdateIndex === -1) {
                    // Create new update item with current item data
                    const originalItem = initValues.find(item => item.id === itemId);
                    if (originalItem) {
                        const newUpdateItem = { ...originalItem } as any;
                        updateItems.push(newUpdateItem);
                        existingUpdateIndex = updateItems.length - 1;
                    }
                }

                if (existingUpdateIndex >= 0) {
                    // Convert string to number for quantity fields
                    let processedValue = value;
                    if (['requested_qty', 'approved_qty', 'foc_qty'].includes(fieldName)) {
                        // Allow 0 as a valid value
                        if (value === undefined || value === null || value === '') {
                            processedValue = 0;
                        } else {
                            processedValue = Number(value);
                        }
                    }

                    updateItems[existingUpdateIndex] = {
                        ...updateItems[existingUpdateIndex],
                        [fieldName]: processedValue,
                        // Handle product selection
                        ...(selectedProduct && fieldName === 'product_id' ? {
                            product_name: selectedProduct.name,
                            inventory_unit_id: selectedProduct.inventory_unit_id,
                            inventory_unit_name: selectedProduct.inventory_unit_name,
                        } : {})
                    };

                    // Update form with new update array
                    form.setValue('body.purchase_request_detail.update', updateItems, {
                        shouldValidate: false,
                        shouldDirty: true,
                        shouldTouch: false
                    });
                }
            }

            // Always update state for UI display
            setState(prev => ({
                ...prev,
                updatedItems: {
                    ...prev.updatedItems,
                    [itemId]: {
                        ...prev.updatedItems[itemId],
                        [fieldName]: ['requested_qty', 'approved_qty', 'foc_qty'].includes(fieldName)
                            ? (value !== undefined && value !== null && value !== '' ? Number(value) : 0)
                            : value,
                        // Handle product selection
                        ...(selectedProduct && fieldName === 'product_id' ? {
                            product_name: selectedProduct.name,
                            inventory_unit_id: selectedProduct.inventory_unit_id,
                            inventory_unit_name: selectedProduct.inventory_unit_name,
                        } : {})
                    }
                }
            }));
        }
    }, [addFields, form, initValues]);

    // Remove item
    const removeItem = useCallback((
        itemId: string,
        isNewItem: boolean = false,
        itemIndex?: number
    ) => {
        if (isNewItem && itemIndex !== undefined) {
            // Remove from field array (new items) - this will automatically update UI
            addRemove(itemIndex);
        } else {
            // Mark existing item as removed and add to form remove array
            const currentValues = form.getValues();
            const removeItems = currentValues.body.purchase_request_detail?.remove || [];
            const updateItems = currentValues.body.purchase_request_detail?.update || [];

            // Remove from update array if exists
            const updatedUpdateItems = updateItems.filter((updateItem: any) => updateItem.id !== itemId);
            if (updatedUpdateItems.length !== updateItems.length) {
                form.setValue('body.purchase_request_detail.update', updatedUpdateItems);
            }

            // Add to remove array if not already there
            if (!removeItems.some((removeItem: any) => removeItem.id === itemId)) {
                removeItems.push({ id: itemId });
                form.setValue('body.purchase_request_detail.remove', removeItems);
            }

            // Also update state for UI display
            setState(prev => ({
                ...prev,
                removedItems: new Set(Array.from(prev.removedItems).concat(itemId))
            }));
        }
    }, [addRemove, form]);

    // Helper to get item value (updated or original)
    const getItemValue = useCallback((item: PurchaseRequestDetail, fieldName: string) => {
        // Check if this is a new item (from addFields)
        const isNewItem = addFields.some((field: any) => field.id === item.id);

        if (isNewItem) {
            // Get value directly from form for new items
            const fieldIndex = addFields.findIndex((field: any) => field.id === item.id);
            const formValues = form.getValues();
            const addItems = formValues.body.purchase_request_detail?.add || [];
            const formItem = addItems[fieldIndex];
            return formItem?.[fieldName as keyof typeof formItem]
                ?? item[fieldName as keyof PurchaseRequestDetail];
        } else {
            // Get value from update array in form for existing items
            const formValues = form.getValues();
            const updateItems = formValues.body.purchase_request_detail?.update || [];
            const updateItem = updateItems.find((updateItem: any) => updateItem.id === item.id);

            if (updateItem) {
                return updateItem[fieldName as keyof typeof updateItem]
                    ?? item[fieldName as keyof PurchaseRequestDetail];
            }

            // Fallback to updatedItems state or original item
            return state.updatedItems[item.id]?.[fieldName as keyof PurchaseRequestDetail]
                ?? item[fieldName as keyof PurchaseRequestDetail];
        }
    }, [state.updatedItems, addFields, form]);

    return {
        // State
        items,
        updatedItems: state.updatedItems,
        removedItems: state.removedItems,

        // Actions
        addItem,
        updateItem,
        removeItem,

        // Field array helpers
        addFields,
        appendField: addAppend,
        removeField: addRemove,

        // Helper
        getItemValue
    };
};

export type { UsePurchaseItemManagementReturn };
