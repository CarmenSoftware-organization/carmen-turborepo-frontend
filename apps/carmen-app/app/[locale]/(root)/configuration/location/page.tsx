import LocationComponent from "./_components/LocationComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Locations",
    description: "Locations",
};

export default function LocationsPage() {
    return <LocationComponent />
};
