import { Metadata } from "next";

import PriceListTemplate from "./_components/PriceListTemplate";

export const metadata: Metadata = {
  title: "Price List template",
};

export default function PriceListTemplatePage() {
  return <PriceListTemplate />;
}
