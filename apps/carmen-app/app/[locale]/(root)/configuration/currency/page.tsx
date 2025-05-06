import CurrencyComponent from "./components/CurrencyComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Currency",
};

export default async function CurrencyPage() {
    return <CurrencyComponent />
}
