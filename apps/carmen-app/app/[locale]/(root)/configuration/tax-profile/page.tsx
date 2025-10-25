import { Metadata } from "next";
import { TaxProfileComponent } from "./_components/TaxProfileComponent";

export const metadata: Metadata = {
  title: "Tax Profile",
};

export default function TaxProfile() {
  return <TaxProfileComponent />;
}