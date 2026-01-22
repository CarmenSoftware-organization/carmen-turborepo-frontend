import { createMetadata } from "@/utils/metadata";
import UnitComponent from "./_components/UnitComponent";

export const generateMetadata = createMetadata("Unit", "title");

export default function UnitPage() {
  return <UnitComponent />;
}
