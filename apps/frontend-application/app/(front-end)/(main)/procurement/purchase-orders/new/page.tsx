import React from 'react';
import PoForm from '../components/PoForm';
import { formType } from '@/constants/enums';

const NewPoPage = () => {
	return <PoForm mode={formType.ADD} />;
};

export default NewPoPage;
