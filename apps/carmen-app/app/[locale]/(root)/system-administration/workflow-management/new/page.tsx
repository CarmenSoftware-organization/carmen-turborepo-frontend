'use client';
import React, { useState } from 'react';
import WorkflowDetail from '../components/WorkflowDetail';
import { formType } from '@/dtos/form.dto';

const NewWorkflowPage = () => {
	const [isRefresh, setIsRefresh] = useState(false);

	return (
		<WorkflowDetail
			wfData={null}
			mode={formType.ADD}
			isRefresh={isRefresh}
			setRefresh={setIsRefresh}
		/>
	);
};

export default NewWorkflowPage;
