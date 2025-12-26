import { createMetadata } from "@/utils/metadata";
import VendorEntry from "./_components/VendorEntry";

export const generateMetadata = createMetadata("vendorEntry", "title");

export default function VendorEntryPage() {
  return <VendorEntry />;
}
