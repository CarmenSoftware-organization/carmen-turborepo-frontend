import { Metadata } from "next";
import FinanceComponentPage from "./FinanceComponentPage";

export const metadata: Metadata = {
    title: "Finance",
};

export default function FinancePage() {
    return <FinanceComponentPage />
}
