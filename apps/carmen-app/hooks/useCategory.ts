"use client";

import { createCategoryService, deleteCategoryService, getCategoryService, updateCategoryService } from "@/services/category.service";
import { useAuth } from "@/context/AuthContext";
import { CategoryDto } from "@/dtos/category.dto";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
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
                const data = await getCategoryService(token, tenantId);
                if (data.statusCode === 401) {
                    setIsUnauthorized(true);
                    return;
                }
                setCategories(data);
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
        if (!token) return;

        const submitAdd = async () => {
            try {
                const result = await createCategoryService(token, tenantId, data);
                console.log('result', result);

                const newCategory: CategoryDto = {
                    ...data,
                    id: result.id,
                };

                console.log('new category', newCategory);


                setCategories([...categories, newCategory]);
                toastSuccess({ message: 'Category created successfully' });
            } catch (error) {
                console.error('Error creating category:', error);
                toastError({ message: 'Error creating category' });
            }
        };

        const submitEdit = async () => {
            try {
                const updatedCategory: CategoryDto = {
                    ...data,
                    id: selectedCategory!.id,
                };

                await updateCategoryService(token, tenantId, updatedCategory);

                const id = updatedCategory.id;
                const updatedCategories = categories.map(c =>
                    c.id === id ? updatedCategory : c
                );

                setCategories(updatedCategories);
                toastSuccess({ message: 'Category updated successfully' });
            } catch (error) {
                console.error('Error updating category:', error);
                toastError({ message: 'Error updating category' });
            }
        };

        if (mode === formType.ADD) {
            startTransition(submitAdd);
        } else {
            startTransition(submitEdit);
        }
    }, [token, tenantId, categories]);

    const handleDelete = useCallback((category: CategoryDto) => {
        if (!token) return;
        const submitDelete = async () => {
            try {
                await deleteCategoryService(token, tenantId, category.id ?? '');
                const updatedCategories = categories.filter(c => c.id !== category.id);
                setCategories(updatedCategories);
                toastSuccess({ message: 'Category deleted successfully' });
            } catch (error) {
                console.error('Error deleting category:', error);
                toastError({ message: 'Error deleting category' });
            }
        };

        startTransition(submitDelete);
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

