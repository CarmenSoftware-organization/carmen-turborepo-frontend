import { createMetadata } from "@/utils/metadata";
import VendorComponent from "./_components/VendorComponent";

export const generateMetadata = createMetadata("Vendor", "title");

export default function Vendor() {
  return <VendorComponent />;
}
