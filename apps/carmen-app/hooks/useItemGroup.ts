import { useCallback, useEffect, useState, useTransition } from "react";

import { ItemGroupDto } from "@/dtos/category.dto";
import { useAuth } from "@/context/AuthContext";
import { createItemGroupService, deleteItemGroupService, getItemGroupService, updateItemGroupService } from "@/services/item-group.service";
import { toastError } from "@/components/ui-custom/Toast";
import { formType } from "@/dtos/form.dto";

export const useItemGroup = () => {
    const { token, tenantId } = useAuth();
    const [itemGroups, setItemGroups] = useState<ItemGroupDto[]>([]);
    const [isPending, startTransition] = useTransition();
    const [isUnauthorized, setIsUnauthorized] = useState(false);

    const fetchItemGroups = useCallback(() => {
        if (!token) return;

        const fetchData = async () => {
            try {
                setIsUnauthorized(false);
                const data = await getItemGroupService(token, tenantId);
                if (data.statusCode === 401) {
                    setIsUnauthorized(true);
                    return;
                }
                setItemGroups(data);
            } catch (error) {
                console.error('Error fetching item groups:', error);
                toastError({ message: 'Error fetching item groups' });
            }
        };

        startTransition(fetchData);
    }, [token, tenantId]);

    useEffect(() => {
        fetchItemGroups();
    }, [fetchItemGroups]);

    const handleSubmit = useCallback((data: ItemGroupDto, mode: formType, selectedItemGroup?: ItemGroupDto) => {
        if (!token) return Promise.reject(new Error('No token available'));

        const submitAdd = async () => {
            try {
                const result = await createItemGroupService(token, tenantId, data);
                const newItemGroup: ItemGroupDto = {
                    ...data,
                    id: result.id,
                };
                setItemGroups([...itemGroups, newItemGroup]);
                return result;
            } catch (error) {
                console.error('Error creating item group:', error);
                throw error;
            }
        };

        const submitEdit = async () => {
            try {
                const updatedItemGroup: ItemGroupDto = {
                    ...data,
                    id: selectedItemGroup!.id,
                };
                const result = await updateItemGroupService(token, tenantId, updatedItemGroup);
                const id = updatedItemGroup.id;
                const updatedItemGroups = itemGroups.map(c =>
                    c.id === id ? updatedItemGroup : c
                );
                setItemGroups(updatedItemGroups);
                return result;
            } catch (error) {
                console.error('Error updating item group:', error);
                throw error;
            }
        };

        if (mode === formType.ADD) {
            return submitAdd();
        } else {
            return submitEdit();
        }
    }, [token, tenantId, itemGroups]);

    const handleDelete = useCallback((itemGroup: ItemGroupDto) => {
        if (!token) return Promise.reject(new Error('No token available'));

        const submitDelete = async () => {
            try {
                const result = await deleteItemGroupService(token, tenantId, itemGroup.id ?? '');
                const updatedItemGroups = itemGroups.filter(c => c.id !== itemGroup.id);
                setItemGroups(updatedItemGroups);
                return result;
            } catch (error) {
                console.error('Error deleting item group:', error);
                throw error;
            }
        };

        return submitDelete();
    }, [token, tenantId, itemGroups]);


    return {
        itemGroups,
        isPending,
        isUnauthorized,
        fetchItemGroups,
        handleSubmit,
        handleDelete
    }
}