import { createMetadata } from "@/utils/metadata";
import ExtraCostComponent from "./_components/ExtraCostComponent";

export const generateMetadata = createMetadata("ExtraCost", "title");

export default function ExtraCost() {
  return <ExtraCostComponent />;
}
