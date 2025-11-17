import { Metadata } from "next";
import Rfp from "./_components/Rfp";

export const metadata: Metadata = {
  title: "Request for Pricing (RFP)",
};

export default function RfpPage() {
  return <Rfp />;
}
