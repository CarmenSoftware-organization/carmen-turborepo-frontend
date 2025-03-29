"use client"

import FormSpotCheck from "../components/FormSpotCheck";
import { formType } from "@/dtos/form.dto";
import { useParams } from 'next/navigation'
import { mockSpotCheckData } from "@/mock-data/inventory-management";

export default function SpotCheckIdPage() {
    const params = useParams();
    const id = params.id as string;
    const spotCheck = mockSpotCheckData.find(spotCheck => spotCheck.id === id);
    return <FormSpotCheck mode={formType.EDIT} initialValues={spotCheck} />
}
