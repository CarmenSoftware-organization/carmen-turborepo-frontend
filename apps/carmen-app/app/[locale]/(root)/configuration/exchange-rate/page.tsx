import { Metadata } from "next";
import ExchangeRateComponent from "./components/ExchangeRateComponent";

export const metadata: Metadata = {
    title: "Exchange Rate",
    description: "Exchange Rate",
}

export default function ExchangeRatePage() {
    return <ExchangeRateComponent />
}
