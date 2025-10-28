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

    const [state, setState] = useState<PurchaseItemState>({
        updatedItems: {},
        removedItems: new Set()
    });

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

    // Helper: Process quantity field values
    const processQuantityValue = useCallback((fieldName: string, value: any): any => {
        if (!['requested_qty', 'approved_qty', 'foc_qty'].includes(fieldName)) {
            return value;
        }
        if (value === undefined || value === null || value === '') {
            return 0;
        }
        return Number(value);
    }, []);

    // Helper: Get product selection fields
    const getProductFields = useCallback((fieldName: string, selectedProduct?: any) => {
        if (!selectedProduct || fieldName !== 'product_id') {
            return {};
        }
        return {
            product_name: selectedProduct.name,
            inventory_unit_id: selectedProduct.inventory_unit_id,
            inventory_unit_name: selectedProduct.inventory_unit_name,
        };
    }, []);

    // Helper: Update new item in add array
    const updateNewItemInForm = useCallback((
        fieldIndex: number,
        fieldName: string,
        value: any,
        selectedProduct?: any
    ) => {
        const currentValues = form.getValues();
        const updatedAddItems = [...(currentValues.body.purchase_request_detail?.add || [])];

        if (!updatedAddItems[fieldIndex]) return;

        const processedValue = processQuantityValue(fieldName, value);
        const productFields = getProductFields(fieldName, selectedProduct);

        updatedAddItems[fieldIndex] = {
            ...updatedAddItems[fieldIndex],
            [fieldName]: processedValue,
            ...productFields
        };

        form.setValue('body.purchase_request_detail.add', updatedAddItems, {
            shouldValidate: false,
            shouldDirty: true,
            shouldTouch: true
        });

        // Clear and re-trigger validation
        setTimeout(async () => {
            form.clearErrors();
            await form.trigger();
        }, 50);
    }, [form, processQuantityValue, getProductFields]);

    // Helper: Update existing item in update array
    const updateExistingItemInForm = useCallback((
        itemId: string,
        fieldName: string,
        value: any,
        selectedProduct?: any
    ) => {
        const currentValues = form.getValues();
        const updateItems = currentValues.body.purchase_request_detail?.update || [];

        let existingUpdateIndex = updateItems.findIndex((updateItem: any) => updateItem.id === itemId);

        if (existingUpdateIndex === -1) {
            const originalItem = initValues.find(item => item.id === itemId);
            if (!originalItem) return;

            updateItems.push({ ...originalItem } as any);
            existingUpdateIndex = updateItems.length - 1;
        }

        const processedValue = processQuantityValue(fieldName, value);
        const productFields = getProductFields(fieldName, selectedProduct);

        updateItems[existingUpdateIndex] = {
            ...updateItems[existingUpdateIndex],
            [fieldName]: processedValue,
            ...productFields
        };

        form.setValue('body.purchase_request_detail.update', updateItems, {
            shouldValidate: false,
            shouldDirty: true,
            shouldTouch: false
        });
    }, [form, initValues, processQuantityValue, getProductFields]);

    // Helper: Update state for UI display
    const updateStateForDisplay = useCallback((
        itemId: string,
        fieldName: string,
        value: any,
        selectedProduct?: any
    ) => {
        const processedValue = processQuantityValue(fieldName, value);
        const productFields = getProductFields(fieldName, selectedProduct);

        setState(prev => ({
            ...prev,
            updatedItems: {
                ...prev.updatedItems,
                [itemId]: {
                    ...prev.updatedItems[itemId],
                    [fieldName]: processedValue,
                    ...productFields
                }
            }
        }));
    }, [processQuantityValue, getProductFields]);

    // Update item field
    const updateItem = useCallback((
        itemId: string,
        fieldName: string,
        value: any,
        selectedProduct?: any
    ) => {
        const fieldIndex = addFields.findIndex((field: any) => field.id === itemId);
        const isNewItem = fieldIndex >= 0;

        if (isNewItem) {
            updateNewItemInForm(fieldIndex, fieldName, value, selectedProduct);
        } else {
            const currentValues = form.getValues();
            const hasUpdateField = currentValues.body.purchase_request_detail && 'update' in currentValues.body.purchase_request_detail;

            if (hasUpdateField) {
                updateExistingItemInForm(itemId, fieldName, value, selectedProduct);
            }

            updateStateForDisplay(itemId, fieldName, value, selectedProduct);
        }
    }, [addFields, form, updateNewItemInForm, updateExistingItemInForm, updateStateForDisplay]);

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
