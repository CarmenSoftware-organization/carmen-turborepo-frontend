import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FolderOpen, Pen, Plus } from 'lucide-react';
import React from 'react'
import { EnhancedSubCategory, EnhancedItemGroup } from './ProductOrganizer';
import ItemGroup from './ItemGroup';

interface Props {
    subcategory: EnhancedSubCategory;
    category_id: string;
}

const SubCategory = ({ subcategory, category_id }: Props) => {

    const handleAddSubCategory = (e: React.MouseEvent) => {
        e.stopPropagation();
        alert("Add to subcategory");
    }

    const handleEditSubCategory = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        console.log("Edit category", id, 'in category id', category_id);
    }

    return (
        <Accordion type="single" collapsible className="border-none">
            <AccordionItem value={subcategory.id ?? ''} className="border-b-0">
                <AccordionTrigger className="py-1.5 font-normal hover:no-underline">
                    <div className='flex items-center gap-4'>

                        <div className='flex items-center'>
                            <FolderOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className='text-xs text-muted-foreground'>{subcategory.name}</span>

                            <span className="text-xs text-muted-foreground ml-1">
                                ({subcategory.itemGroups.length})
                            </span>

                        </div>

                        <div className='flex items-center'>
                            <button
                                className="flex items-center justify-center p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-accent-foreground focus:outline-none"
                                onClick={(e) => handleEditSubCategory(e, subcategory.id ?? '')}
                            >
                                <Pen className="h-3 w-3" />
                            </button>
                            <button
                                className="flex items-center justify-center p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-accent-foreground focus:outline-none"
                                onClick={(e) => handleAddSubCategory(e)}
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                </AccordionTrigger>
                <AccordionContent>
                    <div className="ml-6 border-l border-border/30 pl-2 space-y-1">
                        {subcategory.itemGroups.length === 0 ? (
                            <div className="py-2 text-xs text-muted-foreground">Empty Item Group</div>
                        ) : (
                            subcategory.itemGroups.map((itemGroup: EnhancedItemGroup) => (
                                <ItemGroup key={itemGroup.id ?? ''} itemGroup={itemGroup} sub_cat_id={subcategory.id ?? ''} />
                            ))
                        )}
                    </div>

                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

export default SubCategory