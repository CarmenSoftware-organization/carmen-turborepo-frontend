import PhysicalCountComponent from "./_components/PhysicalCountComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Physical Count",
};

export default function PhysicalCountPage() {
  return <PhysicalCountComponent />;
}
