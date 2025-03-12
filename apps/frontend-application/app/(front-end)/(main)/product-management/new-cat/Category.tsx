import React, { useState } from 'react'
import { EnhancedCategory, EnhancedSubCategory } from './ProductOrganizer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Folder, Pen, Plus } from 'lucide-react';
import SubCategory from './SubCategory';
import CategoryForm from './CategoryForm';
import { formType } from '@/constants/enums';

interface Props {
    category: EnhancedCategory;
    token: string;
    setCategorys: (categories: EnhancedCategory[]) => void;
    tenantId: string;
}

const Category = ({ category, token, setCategorys, tenantId }: Props) => {
    const [open, setOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<formType>(formType.ADD);
    const [categoryName, setCategoryName] = useState('');
    const [categoryId, setCategoryId] = useState<string>('');

    const handleAddCategory = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDialogMode(formType.ADD);
        setCategoryName('');
        setOpen(true);
    };

    const handleEditClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setDialogMode(formType.EDIT);
        setCategoryName(category.name || '');
        setCategoryId(id);
        setOpen(true);
    };



    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <>
            <Accordion type="single" collapsible className="border-none">
                <AccordionItem value={category.id ?? ''} className="border-b-0">
                    <AccordionTrigger className="py-2 font-medium hover:no-underline">
                        <div className="flex items-center gap-4">

                            <div className='flex items-center'>
                                <Folder className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className='text-xs font-semibold'>{category.name}</span>
                                <span className="text-xs text-muted-foreground ml-2">
                                    ({category.subCategories.length})
                                </span>
                            </div>
                            <div className='flex items-center'>
                                <button
                                    className="flex items-center justify-center p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-accent-foreground focus:outline-none"
                                    onClick={(e) => handleEditClick(e, category.id ?? '')}
                                    aria-label="Edit category"
                                >
                                    <Pen className="h-3 w-3" />
                                </button>
                                <button
                                    className="flex items-center justify-center p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-accent-foreground focus:outline-none"
                                    onClick={(e) => handleAddCategory(e)}
                                    aria-label="Add subcategory"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>

                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="ml-6 border-l border-border/30 pl-2 space-y-1">
                            {category.subCategories.length === 0 ? (
                                <div className="py-2 text-xs text-muted-foreground">Empty Sub Category</div>
                            ) : (
                                category.subCategories.map((subcategory: EnhancedSubCategory) => (
                                    <SubCategory key={subcategory.id ?? ''} subcategory={subcategory} category_id={category.id ?? ''} />
                                ))
                            )}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <CategoryForm
                open={open}
                onOpenChange={setOpen}
                categoryId={categoryId}
                categoryName={categoryName}
                onCancel={handleCancel}
                category={category}
                mode={dialogMode}
                token={token}
                setCategorys={setCategorys}
                tenantId={tenantId}
            />
        </>
    );
}

export default Category