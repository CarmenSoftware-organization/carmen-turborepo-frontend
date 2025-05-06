import { formType } from "@/dtos/form.dto";
import FormProduct from "../components/form/FormProduct";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "New Product",
};

export default function ProductNew() {
    return <FormProduct mode={formType.ADD} />
}