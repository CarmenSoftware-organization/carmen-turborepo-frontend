import { createMetadata } from "@/utils/metadata";
import PlExtComponent from "./_components/PlExtComponent";

export const generateMetadata = createMetadata("PriceList", "vendor_entry");

interface PageProps {
  params: Promise<{ url_token: string }>;
}

export default async function PlExternalPage({ params }: PageProps) {
  const { url_token } = await params;

  return <PlExtComponent urlToken={url_token} />;
}
