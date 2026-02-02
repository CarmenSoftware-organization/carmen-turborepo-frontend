import { createMetadata } from "@/utils/metadata";
import DucumentManagementComponent from "./components/DucumentManagementComponent";

export const generateMetadata = createMetadata("DocumentManagement", "title");

export default function DucumentManagementPage() {
  return <DucumentManagementComponent />;
}
