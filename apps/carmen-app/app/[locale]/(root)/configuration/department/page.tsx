import DepartmentComponent from "./_components/DepartmentComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Department",
};

export default function DepartmentPage() {
    return <DepartmentComponent />;
}
