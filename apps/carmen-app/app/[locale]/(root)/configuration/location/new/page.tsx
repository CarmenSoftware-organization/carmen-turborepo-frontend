import { Metadata } from "next";

export const metadata: Metadata = {
    title: "New Location",
    description: "New Location",
};

import { formType } from "@/dtos/form.dto";
import LocationView from "../components/form/LocationView";

export default function NewStoreLocationPage() {
    return <LocationView mode={formType.ADD} />;
}
