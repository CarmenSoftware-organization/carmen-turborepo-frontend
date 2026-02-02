import { createMetadata } from "@/utils/metadata";
import AdjustmentTypeComponent from "./_components/AdjustmentTypeComponent";

export const generateMetadata = createMetadata("AdjustmentType", "title");

export default function AdjustmentTypeListPage() {
  return <AdjustmentTypeComponent />;
}
