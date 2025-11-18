import { createMetadata } from "@/utils/metadata";
import Rfp from "./_components/Rfp";

export const generateMetadata = createMetadata("RFP", "title");

export default function RfpPage() {
  return <Rfp />;
}
