'use client';
import WorkflowDetail from '../components/WorkflowDetail';
import { useParams } from 'next/navigation';

const WorkflowDetailPage = () => {
	const { id } = useParams();

	// eslint-disable-next-line react/react-in-jsx-scope
	return <WorkflowDetail workflowId={id.toString()} />;
};

export default WorkflowDetailPage;
