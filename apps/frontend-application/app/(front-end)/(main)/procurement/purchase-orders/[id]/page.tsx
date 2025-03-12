import { formType } from '@/constants/enums';
import React from 'react';
import PoForm from '../components/PoForm';

const PoIdPage = () => {
	return <PoForm mode={formType.EDIT} po="id somthing" />;
};

export default PoIdPage;
