import UnitComponent from "./components/UnitComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Unit",
};

export default function UnitPage() {
    return <UnitComponent />
}
