import { Metadata } from "next";
import ExtraCostComponent from "./_components/ExtraCostComponent";

export const metadata: Metadata = {
  title: "Extra Cost",
};

export default function ExtraCost() {
  return <ExtraCostComponent />;
}