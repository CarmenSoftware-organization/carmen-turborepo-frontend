import VendorPage from "./VendorPage";
import { createMetadata } from "@/utils/metadata";

export const generateMetadata = createMetadata("VendorManagement", "title");

export default function VendorManagement() {
  return <VendorPage />;
}
