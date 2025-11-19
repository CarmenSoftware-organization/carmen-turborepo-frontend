import { createMetadata } from "@/utils/metadata";
import DepartmentComponent from "./_components/DepartmentComponent";

export const generateMetadata = createMetadata("Department", "title");

export default function DepartmentPage() {
  return <DepartmentComponent />;
}
