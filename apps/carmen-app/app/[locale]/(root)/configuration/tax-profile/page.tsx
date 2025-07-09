import { Metadata } from "next";
import { TaxProfileComponent } from "./components/TaxProfileComponent";

export const metadata: Metadata = {
  title: "Tax Profile",
};

export default function TaxProfile() {
  return <TaxProfileComponent />;
}