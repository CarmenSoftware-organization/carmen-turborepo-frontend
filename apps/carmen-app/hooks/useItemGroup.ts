import { useCallback, useEffect, useState, useTransition } from "react";

import { ItemGroupDto } from "@/dtos/category.dto";
import { useAuth } from "@/context/AuthContext";
import { createItemGroupService, deleteItemGroupService, getItemGroupService, updateItemGroupService } from "@/services/item-group.service";
import { toastError } from "@/components/ui-custom/Toast";
import { formType } from "@/dtos/form.dto";

export const useItemGroup = () => {
    const { token, buCode } = useAuth();
    const [itemGroups, setItemGroups] = useState<ItemGroupDto[]>([]);
    const [isPending, startTransition] = useTransition();
    const [isUnauthorized, setIsUnauthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchItemGroups = useCallback(() => {
        if (!token || !buCode) {
            setIsUnauthorized(true);
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setIsLoading(true);
                setIsUnauthorized(false);

                const data = await getItemGroupService(token, buCode);

                if (data.statusCode === 401) {
                    setIsUnauthorized(true);
                    return;
                }

                if (!data.data) {
                    console.error('Unexpected API response format:', data);
                    toastError({ message: 'Unexpected data format from API' });
                    setItemGroups([]);
                    return;
                }

                setItemGroups(data.data);
            } catch (error) {
                console.error('Error fetching item groups:', error);
                toastError({ message: 'Error fetching item groups' });
                setItemGroups([]);
            } finally {
                setIsLoading(false);
            }
        };

        startTransition(fetchData);
    }, [token, buCode]);

    useEffect(() => {
        fetchItemGroups();
    }, [fetchItemGroups]);

    const handleSubmit = useCallback((data: ItemGroupDto, mode: formType, selectedItemGroup?: ItemGroupDto) => {
        if (!token || !buCode) {
            toastError({ message: 'Authentication required' });
            return Promise.reject(new Error('No token or tenant ID available'));
        }

        const submitAdd = async () => {
            try {
                const result = await createItemGroupService(token, buCode, data);

                if (!result?.id) {
                    toastError({ message: 'Failed to create item group' });
                    return null;
                }

                const newItemGroup: ItemGroupDto = {
                    ...data,
                    id: result.id,
                };
                setItemGroups(prev => [...prev, newItemGroup]);
                return result;
            } catch (error) {
                console.error('Error creating item group:', error);
                toastError({ message: 'Error creating item group' });
                throw error;
            }
        };

        const submitEdit = async () => {
            if (!selectedItemGroup?.id) {
                toastError({ message: 'Item group ID is required for update' });
                return Promise.reject(new Error('Item group ID is required'));
            }

            try {
                const updatedItemGroup: ItemGroupDto = {
                    ...data,
                    id: selectedItemGroup.id,
                };
                const result = await updateItemGroupService(token, buCode, updatedItemGroup);

                if (!result) {
                    toastError({ message: 'Failed to update item group' });
                    return null;
                }

                const id = updatedItemGroup.id;
                setItemGroups(prev => prev.map(c => c.id === id ? updatedItemGroup : c));
                return result;
            } catch (error) {
                console.error('Error updating item group:', error);
                toastError({ message: 'Error updating item group' });
                throw error;
            }
        };

        if (mode === formType.ADD) {
            return submitAdd();
        } else {
            return submitEdit();
        }
    }, [token, buCode]);

    const handleDelete = useCallback((itemGroup: ItemGroupDto) => {
        if (!token || !buCode) {
            toastError({ message: 'Authentication required' });
            return Promise.reject(new Error('No token or tenant ID available'));
        }

        if (!itemGroup?.id) {
            toastError({ message: 'Item group ID is required for deletion' });
            return Promise.reject(new Error('Item group ID is required'));
        }

        const submitDelete = async () => {
            try {
                const result = await deleteItemGroupService(token, buCode, itemGroup.id);

                if (!result) {
                    toastError({ message: 'Failed to delete item group' });
                    return null;
                }

                setItemGroups(prev => prev.filter(c => c.id !== itemGroup.id));
                return result;
            } catch (error) {
                console.error('Error deleting item group:', error);
                toastError({ message: 'Error deleting item group' });
                throw error;
            }
        };

        return submitDelete();
    }, [token, buCode]);


    return {
        itemGroups,
        isPending,
        isUnauthorized,
        isLoading,
        fetchItemGroups,
        handleSubmit,
        handleDelete
    }
}