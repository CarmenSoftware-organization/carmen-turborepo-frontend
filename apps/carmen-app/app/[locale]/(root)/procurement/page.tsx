import { Metadata } from "next";
import ProcurementPage from "./ProcurementPage";

export const metadata: Metadata = {
    title: "Procurement",
};

export default function Procurement() {
    return <ProcurementPage />
}