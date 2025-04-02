"use client";

import { useAuth } from "@/context/AuthContext";
import { SubCategoryDto } from "@/dtos/category.dto";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { createSubCategoryService, deleteSubCategoryService, getSubCategoryService, updateSubCategoryService } from "@/services/sub-category.service";
import { formType } from "@/dtos/form.dto";

export const useSubCategory = () => {
    const { token, tenantId } = useAuth();
    const [subCategories, setSubCategories] = useState<SubCategoryDto[]>([]);
    const [isPending, startTransition] = useTransition();
    const [isUnauthorized, setIsUnauthorized] = useState(false);

    const fetchSubCategories = useCallback(() => {
        if (!token) return;

        const fetchData = async () => {
            try {
                setIsUnauthorized(false);
                const data = await getSubCategoryService(token, tenantId);
                if (data.statusCode === 401) {
                    setIsUnauthorized(true);
                    return;
                }
                setSubCategories(data);
            } catch (error) {
                console.error('Error fetching sub categories:', error);
                toastError({ message: 'Error fetching sub categories' });
            }
        };

        startTransition(fetchData);
    }, [token, tenantId]);

    useEffect(() => {
        fetchSubCategories();
    }, [fetchSubCategories]);

    const handleSubmit = useCallback((data: SubCategoryDto, mode: formType, selectedSubCategory?: SubCategoryDto) => {
        if (!token) return;

        const submitAdd = async () => {
            try {
                const result = await createSubCategoryService(token, tenantId, data);
                const newSubCategory: SubCategoryDto = {
                    ...data,
                    id: result.id,
                };
                setSubCategories([...subCategories, newSubCategory]);
                toastSuccess({ message: 'Sub category created successfully' });
            } catch (error) {
                console.error('Error creating sub category:', error);
                toastError({ message: 'Error creating sub category' });
            }
        };

        const submitEdit = async () => {
            try {
                const updatedSubCategory: SubCategoryDto = {
                    ...data,
                    id: selectedSubCategory!.id,
                };
                await updateSubCategoryService(token, tenantId, updatedSubCategory);
                const id = updatedSubCategory.id;
                const updatedSubCategories = subCategories.map(c =>
                    c.id === id ? updatedSubCategory : c
                );
                setSubCategories(updatedSubCategories);
                toastSuccess({ message: 'Sub category updated successfully' });
            } catch (error) {
                console.error('Error updating sub category:', error);
                toastError({ message: 'Error updating sub category' });
            }
        };

        if (mode === formType.ADD) {
            startTransition(submitAdd);
        } else {
            startTransition(submitEdit);
        }
    }, [token, tenantId, subCategories]);


    const handleDelete = useCallback((subCategory: SubCategoryDto) => {
        if (!token) return;
        const submitDelete = async () => {
            try {
                await deleteSubCategoryService(token, tenantId, subCategory.id ?? '');
                const updatedSubCategories = subCategories.filter(c => c.id !== subCategory.id);
                setSubCategories(updatedSubCategories);
                toastSuccess({ message: 'Sub category deleted successfully' });
            } catch (error) {
                console.error('Error deleting sub category:', error);
                toastError({ message: 'Error deleting sub category' });
            }
        };

        startTransition(submitDelete);
    }, [token, tenantId, subCategories]);

    return {
        subCategories,
        isPending,
        isUnauthorized,
        fetchSubCategories,
        handleSubmit,
        handleDelete
    }
}