import { createMetadata } from "@/utils/metadata";
import VendorPortal from "./_components/VendorPortal";

export const generateMetadata = createMetadata("VendorPortal", "title");
export default function VendorPortalPage() {
  return <VendorPortal />;
}
