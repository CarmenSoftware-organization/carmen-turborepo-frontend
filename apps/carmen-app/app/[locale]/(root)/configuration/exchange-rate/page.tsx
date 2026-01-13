import { createMetadata } from "@/utils/metadata";
import ExcComponent from "./ExcComponent";

export const generateMetadata = createMetadata("ExchangeRate", "title");

export default function ExchangeRatePage() {
  return <ExcComponent />;
}
