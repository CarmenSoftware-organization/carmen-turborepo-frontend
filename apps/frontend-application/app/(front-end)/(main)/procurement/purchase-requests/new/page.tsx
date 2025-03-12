'use client';
import React from 'react';
import PrDetail from '../components/PrDetail';
import { formType } from '@/constants/enums';
const NewPurchaseRequestPage = () => {
	return <PrDetail data-id="new-pr-form" formType={formType.ADD} />;
};

export default NewPurchaseRequestPage;
