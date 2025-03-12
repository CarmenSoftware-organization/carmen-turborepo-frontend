import { FormAction } from '@/lib/types';
import React from 'react';

interface Props {
    id?: string;
    poMode?: FormAction;
}

const PurchaseOrdersComponent: React.FC<Props> = ({ id, poMode }) => {
    return (
        <>
            <span>PurchaseOrdersComponent</span>
            {id && (
                <div>{id}</div>
            )}
            {poMode && (
                <div>{poMode}</div>
            )}
        </>
    );
};

export default PurchaseOrdersComponent;
