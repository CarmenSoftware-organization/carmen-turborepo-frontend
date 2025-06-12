import { Metadata } from "next";

export const metadata: Metadata = {
    title: "New Location",
    description: "New Location",
};

import { formType } from "@/dtos/form.dto";
import MainLocation from "../components/form/MainLocation";

export default function NewStoreLocationPage() {
    return <MainLocation mode={formType.ADD} />
}
