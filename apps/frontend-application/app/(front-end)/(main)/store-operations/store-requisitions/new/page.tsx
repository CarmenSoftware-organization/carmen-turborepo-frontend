import React from 'react'
import StoreRequisitionsDetails from '../components/StoreRequisitionsDetails'
import { formType } from '@/constants/enums'

const NewStoreRequisitionPage = () => {
    return (
        <StoreRequisitionsDetails
            storeRequisition={null}
            mode={formType.ADD}
        />
    )
}

export default NewStoreRequisitionPage