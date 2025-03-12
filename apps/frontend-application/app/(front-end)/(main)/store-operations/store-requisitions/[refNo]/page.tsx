"use client";
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { requisitions, RequisitionType } from '../data'
import StoreRequisitionsDetails from '../components/StoreRequisitionsDetails'
import { formType } from '@/constants/enums';

const StoreRequisitionsIdPage = () => {
    const { refNo } = useParams() as { refNo: string }
    const [storeRequisition, setStoreRequisition] = useState<RequisitionType[] | null>(null);
    useEffect(() => {
        const requisition = requisitions.filter((req) => req.refNo === refNo);
        setStoreRequisition(requisition.length > 0 ? requisition : null);
    }, [refNo]);

    return (
        <StoreRequisitionsDetails
            storeRequisition={storeRequisition}
            mode={formType.EDIT}
        />
    )
}

export default StoreRequisitionsIdPage