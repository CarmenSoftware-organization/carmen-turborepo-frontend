import { Package, Pen } from 'lucide-react';
import React from 'react'
import { EnhancedItemGroup } from './ProductOrganizer';

interface Props {
    itemGroup: EnhancedItemGroup;
    sub_cat_id: string;
}

const ItemGroup = ({ itemGroup, sub_cat_id }: Props) => {

    const onEditItemGroup = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        console.log('Edit item group', id, 'sub category', sub_cat_id);
    };

    return (
        <div className="py-1.5 pl-1 flex items-center group gap-4 hover:bg-accent/40 rounded-md">
            <div className="flex items-center">
                <Package className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{itemGroup.name}</span>
            </div>
            <div className="flex items-center">
                <button
                    className="flex items-center justify-center p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-accent-foreground focus:outline-none"
                    onClick={(e) => onEditItemGroup(e, itemGroup.id ?? '')}
                >
                    <Pen className="h-3 w-3" />
                </button>
            </div>

        </div>
    );
}

export default ItemGroup