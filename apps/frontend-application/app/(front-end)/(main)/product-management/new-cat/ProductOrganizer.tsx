'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthContext';
import { ProductCategoryCreateModel } from '@/dtos/product-category.dto';
import { ProductSubCategoryCreateModel } from '@/dtos/product-sub-category.dto';
import { ProductItemGroupCreateModel } from '@/dtos/product-item-group.dto';
import { fetchItemGroup } from '@/services/item_group';
import { fetchCategoryList } from '@/services/category';
import { fetchSubProduct } from '@/services/sub_category';
import Category from './Category';

export interface EnhancedItemGroup extends ProductItemGroupCreateModel {
    itemCount: number;
}

export interface EnhancedSubCategory extends ProductSubCategoryCreateModel {
    itemGroups: EnhancedItemGroup[];
}

export interface EnhancedCategory extends ProductCategoryCreateModel {
    subCategories: EnhancedSubCategory[];
}

const ProductOrganizer = () => {
    const { accessToken, tenantId } = useAuth();
    const token = accessToken || '';
    const [categorys, setCategorys] = useState<EnhancedCategory[]>([]);
    const [subCategorys, setSubCategorys] = useState<
        ProductSubCategoryCreateModel[]
    >([]);
    const [itemGroups, setItemGroups] = useState<ProductItemGroupCreateModel[]>(
        []
    );

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productResponse, subProductResponse, itemGroupResponse] =
                    await Promise.all([
                        fetchCategoryList(token, tenantId),
                        fetchSubProduct(token, tenantId),
                        fetchItemGroup(token, tenantId),
                    ]);

                setCategorys(
                    Array.isArray(productResponse.data.data)
                        ? productResponse.data.data
                        : ([productResponse.data.data] as EnhancedCategory[])
                );
                setSubCategorys(
                    subProductResponse.data.data as ProductSubCategoryCreateModel[]
                );
                setItemGroups(
                    itemGroupResponse.data.data as ProductItemGroupCreateModel[]
                );
            } catch (err) {
                console.error(err);
                setError('An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, tenantId]);

    const prepareTreeData = (): EnhancedCategory[] => {
        return categorys.map(category => {
            const subCategories = subCategorys
                .filter(subCat => subCat.product_category_id === category.id)
                .map(subCat => {
                    const filteredItemGroups = itemGroups
                        .filter((itemGroup: ProductItemGroupCreateModel) => itemGroup.product_subcategory_id === subCat.id)
                        .map((itemGroup: ProductItemGroupCreateModel) => ({
                            ...itemGroup,
                            itemCount: 0
                        }));

                    return {
                        ...subCat,
                        itemGroups: filteredItemGroups
                    };
                });

            return {
                ...category,
                subCategories
            };
        });
    };

    const treeData = prepareTreeData();

    if (loading) {
        return (
            <div className="w-full max-w-3xl mx-auto flex items-center justify-center py-10">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                    <p className="mt-2 text-sm text-gray-600">Loading product categories...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-3xl mx-auto py-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p className="font-medium">Error</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full animate-fade-in max-w-3xl mx-auto">
            {treeData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No product categories found.</p>
                </div>
            ) : (
                <div className="space-y-1 text-sm mt-3">
                    {treeData.map((category) => (
                        <Category key={category.id} category={category} token={token} setCategorys={setCategorys} tenantId={tenantId} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductOrganizer;