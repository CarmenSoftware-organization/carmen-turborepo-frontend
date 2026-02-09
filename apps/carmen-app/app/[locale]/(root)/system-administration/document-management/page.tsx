import { createMetadata } from "@/utils/metadata";
import DocumentManagementComponent from "./components/DocumentManagementComponent";

export const generateMetadata = createMetadata("DocumentManagement", "title");

export default function DocumentManagementPage() {
  return <DocumentManagementComponent />;
}
