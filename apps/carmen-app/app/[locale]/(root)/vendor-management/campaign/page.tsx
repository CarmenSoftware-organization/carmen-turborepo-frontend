import { Metadata } from "next";
import Campaign from "./_components/Campaign";

export const metadata: Metadata = {
  title: "Campaign",
};

export default function CampaignPage() {
  return <Campaign />;
}
