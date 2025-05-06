import PhysicalCountManagementComponent from "./components/PhysicalCountManagementComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Physical Count Management",
};

export default function PhysicalCountManagementPage() {
    return <PhysicalCountManagementComponent />
}
