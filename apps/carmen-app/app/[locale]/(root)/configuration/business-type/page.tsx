import { Metadata } from "next";
import BusinessTypeComponent from "./components/BuTypeComponent";

export const metadata: Metadata = {
  title: "Business Type",
  description: "Business Type",
};

export default function BusinessTypePage() {
  return <BusinessTypeComponent />;
}