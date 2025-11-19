import { createMetadata } from "@/utils/metadata";
import LocationComponent from "./_components/LocationComponent";

export const generateMetadata = createMetadata("StoreLocation", "title");

export default function LocationsPage() {
  return <LocationComponent />;
}
