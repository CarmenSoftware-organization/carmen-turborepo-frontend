"use client";

import { createCategoryService, deleteCategoryService, getCategoryService, updateCategoryService } from "@/services/category.service";
import { useAuth } from "@/context/AuthContext";
import { CategoryDto } from "@/dtos/category.dto";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toastError } from "@/components/ui-custom/Toast";
import { formType } from "@/dtos/form.dto";

export const useCategory = () => {
    const { token, tenantId } = useAuth();
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [isPending, startTransition] = useTransition();
    const [isUnauthorized, setIsUnauthorized] = useState(false);


    const fetchCategories = useCallback(() => {
        if (!token) return;
        const fetchData = async () => {
            try {
                setIsUnauthorized(false);
                const data = await getCategoryService(token, tenantId, {
                    sort: 'code',
                });
                if (data.statusCode === 401) {
                    setIsUnauthorized(true);
                    return;
                }
                setCategories(data.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toastError({ message: 'Error fetching categories' });
            }
        };

        startTransition(fetchData);
    }, [token, tenantId]);


    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleSubmit = useCallback((data: CategoryDto, mode: formType, selectedCategory?: CategoryDto) => {
        if (!token) return Promise.reject(new Error('No token available'));

        const submitAdd = async () => {
            try {
                const result = await createCategoryService(token, tenantId, data);

                const newCategory: CategoryDto = {
                    ...data,
                    id: result.id,
                };

                setCategories([...categories, newCategory]);
                return result;
            } catch (error) {
                console.error('Error creating category:', error);
                throw error;
            }
        };

        const submitEdit = async () => {
            try {
                const updatedCategory: CategoryDto = {
                    ...data,
                    id: selectedCategory!.id,
                };

                const result = await updateCategoryService(token, tenantId, updatedCategory);

                const id = updatedCategory.id;
                const updatedCategories = categories.map(c =>
                    c.id === id ? updatedCategory : c
                );

                setCategories(updatedCategories);
                return result;
            } catch (error) {
                console.error('Error updating category:', error);
                throw error;
            }
        };

        if (mode === formType.ADD) {
            return submitAdd();
        } else {
            return submitEdit();
        }
    }, [token, tenantId, categories]);

    const handleDelete = useCallback((category: CategoryDto) => {
        if (!token) return Promise.reject(new Error('No token available'));
        const submitDelete = async () => {
            try {
                const result = await deleteCategoryService(token, tenantId, category.id ?? '');
                const updatedCategories = categories.filter(c => c.id !== category.id);
                setCategories(updatedCategories);
                return result;
            } catch (error) {
                console.error('Error deleting category:', error);
                throw error;
            }
        };

        return submitDelete();
    }, [token, tenantId, categories]);

    return {
        categories,
        isPending,
        isUnauthorized,
        fetchCategories,
        handleSubmit,
        handleDelete
    }
}

