import { Metadata } from "next";

export const metadata: Metadata = {
    title: "New Location",
    description: "New Location",
};

import { formType } from "@/dtos/form.dto";
import LocationForm from "../components/form/LocationForm";

export default function NewStoreLocationPage() {
    return <LocationForm mode={formType.ADD} />
}
