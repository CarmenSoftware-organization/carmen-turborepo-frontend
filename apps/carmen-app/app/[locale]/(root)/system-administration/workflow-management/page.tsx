import { createMetadata } from "@/utils/metadata";
import WorkflowComponent from "./_components/WorkflowComponent";

export const generateMetadata = createMetadata("Workflow", "title");

export default function WorkflowPage() {
  return <WorkflowComponent />;
}
