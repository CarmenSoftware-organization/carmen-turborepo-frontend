import { createMetadata } from "@/utils/metadata";
import ExchangeRateComponent from "./ExchangeRateComponent";

export const generateMetadata = createMetadata("ExchangeRate", "title");

export default function ExchangeRatePage() {
  return <ExchangeRateComponent />;
}
