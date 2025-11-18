import { createMetadata } from "@/utils/metadata";
import { ReactNode } from "react";

export const generateMetadata = createMetadata("RFP", "id_rfp_meta");

export default function IdRfpLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
