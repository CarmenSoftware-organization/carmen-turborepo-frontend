import DashboardComponent from "./components/DashboardComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Procurement Dashboard",
};
export default function DashboardPage() {
    return <DashboardComponent />
}
