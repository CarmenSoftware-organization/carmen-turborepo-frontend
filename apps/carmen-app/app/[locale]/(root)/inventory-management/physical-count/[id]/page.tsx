"use client";
import { mockPhysicalCountData } from "@/mock-data/inventory-management";
import FormPcm from "../_components/FormPcm";
import { formType } from "@/dtos/form.dto";
import { useParams } from "next/navigation";

export default function PhysicalCountPage() {
  const params = useParams();
  const id = params.id as string;
  const pcm = mockPhysicalCountData.find((pcm) => pcm.id === id);
  return <FormPcm mode={formType.EDIT} initialValues={pcm} />;
}
